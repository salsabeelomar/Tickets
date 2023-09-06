import { Injectable, Inject } from '@nestjs/common';
import { CreateTracking } from './dto/create-tracking.dto';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { Tracking } from './models/tracking.model';
import { TicketStatusService } from '../ticket-status/ticket-status.service';
import { Op, Transaction } from 'sequelize';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { TicketService } from '../ticket/ticket.service';
import { VerifyEmailService } from '../verify-email/verify-email.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TICKET_EVENTS } from 'src/common/events/ticket.events';

import { UserToken } from '../auth/dto/generate-Token.dto';
import { Ticket } from '../ticket/models/ticket.model';
import { TicketStatus } from '../ticket-status/models/ticket-status.model';

@Injectable()
export class TrackingService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.TRACKING) private readonly trackingRepo: typeof Tracking,
    private readonly StatusService: TicketStatusService,
    private readonly ticketService: TicketService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async addTracking(
    addStatus: CreateTracking,
    user: UserToken,
    transaction: Transaction,
  ) {
    const newTrack = await this.create(
      {
        statusId: addStatus.statusId,
        comments: JSON.stringify(addStatus?.comments || []),
        ticketId: addStatus.ticketId,
        scheduledFor: addStatus.scheduledFor || null,
        assignmentId: addStatus.assignedFor,
        createdBy: user.id,
      },
      transaction,
    );

    await this.ticketService.update(
      {
        statusId: addStatus.statusId,
        assignmentId: addStatus.assignmentId,
        updatedBy: addStatus.assignmentId,
      },
      {
        id: addStatus.ticketId,
      },
      transaction,
    );
    await this.notify(
      {
        id: addStatus.ticketId,
        userId: user.id,
        status: addStatus.status,
      },
      transaction,
      addStatus?.comments || [],
    );

    return { data: newTrack };
  }

  async openTicket(
    addStatus: Omit<CreateTracking, 'statusId'>,
    userId: number,
    transaction: Transaction,
  ) {
    const action = await this.create(
      {
        status: addStatus.status,
        ticketId: addStatus.ticketId,
        createdBy: userId,
      },
      transaction,
    );

    return {
      data: {
        newAction: action,
      },
      msg: 'Open Ticket Successfully',
    };
  }

  async create(att, transaction: Transaction) {
    await this.checkTicket(att.ticketId, transaction);

    const addAction = await this.trackingRepo.create(att, { transaction });

    this.logger.log(
      `Create new Tracking with #${att.statusId} for Ticket ${att.ticketId}`,
    );
    return addAction;
  }

  async checkTicket(ticketId: number, transaction: Transaction) {
    const checkConfirm = await this.ticketService.CheckConfirm(ticketId);

    CheckExisting(checkConfirm, {
      msg: "The Ticket isn't Confirmed or Closed ",
      trace: 'TrackingService.matchStatus',
    });

    const statusId = await this.StatusService.findOne('Closed', transaction);

    const checkClosed = await this.trackingRepo.findOne({
      where: {
        [Op.and]: {
          statusId: statusId,
          ticketId: ticketId,
        },
      },
      transaction,
    });

    CheckExisting(!checkClosed, {
      msg: ` this all ready Closed `,
      trace: `Tracking.checkClosed`,
    });

    return checkClosed;
  }

  async notify(ticket, transaction: Transaction, comment?: string[]) {
    const ticInfo = await this.ticketService.getTicById(ticket.id, transaction);

    if (comment?.length > 0) {
      this.eventEmitter.emit(TICKET_EVENTS.ADD_RESPONSE, {
        notifiedId: ticInfo.userId,
        title: ticInfo.title,
        comments: comment,
        ticketId: ticket.id,
        status: ticket.status,
      });
      return this.verifyEmailService.receiveRespTic({
        email: ticInfo.user.email,
        username: ticInfo.user.username,
        title: ticInfo.title,
      });
    }

    this.eventEmitter.emit(TICKET_EVENTS.UPDATE_STATUS, {
      notifiedId: ticInfo.userId,
      title: ticInfo.title,
      ticketId: ticket.id,
      status: ticket.status,
    });

    return this.verifyEmailService.sendUpdateTicket(ticket.status, {
      ...ticInfo.user,
      title: ticInfo.title,
    });
  }

  async getLogicOfLate() {
    const i = await this.trackingRepo.findAll({
      attributes: ['scheduledFor', 'id'],
      include: [
        {
          model: Ticket,
          include: [
            {
              model: TicketStatus,
              attributes: ['status'],
              where: {
                status: 'Scheduled',
              },
            },
          ],
        },
      ],
      where: {
        scheduledFor: {
          [Op.lt]: new Date(),
        },
      },
    });
    return i;
  }
}
