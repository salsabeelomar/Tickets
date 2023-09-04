import { Injectable, Inject } from '@nestjs/common';
import { CreateTracking } from './dto/create-tracking.dto';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { Tracking } from './models/tracking.model';
import { TicketStatusService } from '../ticket-status/ticket-status.service';
import { Op, Transaction } from 'sequelize';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { STATUS } from 'src/common/types/Status.types';
import { TicketService } from '../ticket/ticket.service';
import { VerifyEmailService } from '../verify-email/verify-email.service';
import { ConfirmTicket } from '../ticket/dto/confirm-ticket.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TICKET_EVENTS } from 'src/common/events/ticket.events';
import { TicketStatus } from '../ticket-status/models/ticket-status.model';
import { User } from '../user/models/user.model';
import { UserToken } from '../auth/dto/generate-Token.dto';

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
        status: addStatus.status,
        comments: JSON.stringify(addStatus?.comments || []),
        ticketId: addStatus.ticketId,
        scheduleFor: addStatus.scheduleFor || null,
        assignmentId: user.staffId,
        createdBy: user.staffId,
      },
      transaction,
    );

    await this.notify(
      {
        id: addStatus.ticketId,
        userId: user.staffId,
        status: addStatus.status,
      },
      addStatus?.comments || [],
      transaction,
    );

    return newTrack;
  }

  async openTicket(
    addStatus: Omit<CreateTracking, 'statusId'>,
    userId: number,
    transaction: Transaction,
  ) {
    const action = await this.create(
      { status, ticketId: addStatus.ticketId, createdBy: userId },
      transaction,
    );

    return action;
  }

  async create(att, transaction: Transaction) {
    const statusId = await this.StatusService.findOne(att.status, transaction);
    console.log(statusId);
    await this.checkTicket(att.ticketId, transaction);

    const addAction = await this.trackingRepo.create(
      { ...att, statusId: statusId.id },
      { transaction },
    );

    await this.ticketService.update(
      {
        statusId,
        updatedBy: att.assignmentId,
      },
      {
        id: att.ticketId,
        assignmentId: att.assignmentId,
      },
      transaction,
    );

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

  async notify(ticket, comment?: string[], transaction?: Transaction) {
    const ticInfo = await this.ticketService.getTicById(ticket.id);

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
    if (
      ticket.status == STATUS.UNASSIGNED ||
      ticket.status === STATUS.ASSIGNED
    ) {
      this.eventEmitter.emit(TICKET_EVENTS.ASSIGNMENT, {
        notifiedId: ticInfo.staff.id,
        ticketId: ticket.id,
        status: ticket.status,
      });

      return this.verifyEmailService.sendUpdateTicket(ticket.status, {
        ...ticInfo.toJSON().staff,
        title: ticInfo.title,
      });
    } else {
      this.eventEmitter.emit(TICKET_EVENTS.UPDATE_STATUS, {
        notifiedId: ticInfo.userId,
        title: ticInfo.title,
        ticketId: ticket.id,
        status: ticket.status,
      });

      return this.verifyEmailService.sendUpdateTicket(ticket.status, {
        ...ticInfo.toJSON().user,
        title: ticInfo.title,
      });
    }
  }

  async getLogicOfLate(status: STATUS) {
    const getSearched = await this.trackingRepo.findAll({
      attributes: ['createdAt', 'id', 'ticketId', 'sendEmail'],
      include: [
        {
          model: TicketStatus,
          as: 'status',
          attributes: ['status', 'id'],
          where: {
            status,
          },
        },
        {
          model: User,
          as: 'staff',
          attributes: ['email', 'username', 'id'],
        },
      ],
      where: {
        staffId: {
          [Op.not]: null,
        },
      },
    });

    getSearched.map(async (record) => {
      const operation = await this.trackingRepo.findOne({
        attributes: ['id'],
        where: {
          createdAt: { [Op.gt]: record['createdAt'] },
          ticketId: record['ticketId'],
        },
      });

      if (!operation && !record.sendEmail) {
        this.verifyEmailService.sendLateEmails(record.staff);
        await this.trackingRepo.update(
          {
            sendEmail: true,
          },
          {
            where: {
              id: record['id'],
            },
          },
        );
      }

      return operation;
    });
  }
}
