import {
  Injectable,
  Inject,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTracking } from './dto/create-tracking.dto';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { Providers } from 'src/common/constant/providers.constant';
import { Tracking } from './entities/tracking.entity';
import { TicketStatusService } from '../ticket-status/ticket-status.service';
import { Op, Transaction, literal } from 'sequelize';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { Roles } from 'src/common/types/Roles.types';
import { Status } from 'src/common/types/status.types';
import { TicketService } from '../ticket/ticket.service';
import { VerifyEmailService } from '../verify-email/verify-email.service';
import { ConfirmTicket } from '../ticket/dto/confirm-ticket.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TICKET_EVENTS } from 'src/common/events/ticket.events';
import { TicketStatus } from '../ticket-status/entities/ticket-status.entity';
import { User } from '../user/entities/user.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { GenerateToken } from '../auth/dto/generate-Token.dto';

@Injectable()
export class TrackingService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(Providers.TRACKING) private readonly trackingRepo: typeof Tracking,
    private readonly StatusService: TicketStatusService,
    private readonly ticketService: TicketService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async matchStatus(
    addStatus: CreateTracking,
    user: GenerateToken,
    transaction: Transaction,
  ) {
    CheckExisting(
      !(
        user.role === Roles.Support_Staff &&
        (addStatus.status == Status.UnAssigned ||
          addStatus.status == Status.Assigned)
      ),
      ForbiddenException,
      {
        msg: ' Staff tried to UnAssigned OR Assigned Ticket',
        trace: 'TrackingService.addStatus',
      },
    );

    const roleId = `${user.role.toLowerCase()}Id`;

    if (
      addStatus.status == Status.UnAssigned ||
      addStatus.status == Status.Assigned
    ) {
      return this.assignOrUnAssign(addStatus, user, transaction);
    }

    await this.create(
      {
        statusId: addStatus.statusId,
        comments: JSON.stringify(addStatus?.comments || []),
        ticketId: addStatus.ticketId,
        scheduleFor: addStatus.scheduleFor || null,
        [roleId]: user.id,
        createdBy: user.id,
      },
      transaction,
    );
    await this.notify(
      { id: addStatus.ticketId, userId: user.id, status: addStatus.status },
      addStatus?.comments || [],
      transaction,
    );
    this.logger.log(
      `Create Status ${addStatus.status} for Ticket ${addStatus.ticketId}`,
    );

    return {
      statusId: addStatus.statusId,
      comments: addStatus?.comments || [],
      ticketId: addStatus.ticketId,
    };
  }

  async assignOrUnAssign(
    addStatus: CreateTracking,
    user: GenerateToken,
    transaction: Transaction,
  ) {
    const action = await this.create(
      {
        statusId: addStatus.statusId,
        ticketId: addStatus.ticketId,
        adminId: user.id,
        staffId: addStatus.assignedFor,
        createdBy: user.id,
      },
      transaction,
    );
    this.logger.log(`${addStatus.status} for Ticket ${addStatus.ticketId}`);

    const updateStaff = await this.ticketService.updateForSupport(
      addStatus.ticketId,
      {
        staffId: addStatus.assignedFor,
        adminId: user.id,
        updatedBy: user.id,
      },
      transaction,
    );

    await this.notify(
      {
        id: addStatus.ticketId,
        userId: addStatus.assignedFor,
        status: addStatus.status,
      },
      [],
      transaction,
    );
    CheckExisting(updateStaff[0], BadRequestException, {
      msg: 'Tickets Failed To Updated',
      trace: 'TicketsService.updatedOne',
    });

    return {
      status: addStatus.status,
      ticketId: addStatus.ticketId,
      actionId: action.id,
    };
  }

  async openTicket(
    addStatus: CreateTracking,
    userId: number,
    transaction: Transaction,
  ) {
    const statusId = await this.StatusService.findOne(
      addStatus.status,
      transaction,
    );

    const action = await this.create(
      { statusId, ticketId: addStatus.ticketId, createdBy: userId },
      transaction,
    );

    this.logger.log(
      `Create Status ${addStatus.status} for Ticket ${addStatus.ticketId}`,
    );

    return {
      status: 'Open',
      statusId,
      ticketId: addStatus.ticketId,
      actionId: action.id,
    };
  }

  async create(att, transaction: Transaction) {
    const checkCreated = await this.trackingRepo.findOne({
      where: {
        [Op.and]: {
          statusId: att.statusId,
          ticketId: att.ticketId,
          createdBy: att.createdBy,
        },
      },
      transaction,
    });
    CheckExisting(!checkCreated, BadRequestException, {
      msg: ` this all ready exist in same staff and create By `,
      trace: `Tracking.create`,
    });
    const addAction = await this.trackingRepo.create(att, { transaction });

    this.logger.log(`Add Action with ID =${addAction.id}`);

    return { id: addAction.id };
  }

  async confirmTicket(
    confirm: ConfirmTicket,
    userId: number,
    transaction: Transaction,
  ) {
    if (confirm.isConfirm === 'decline') return 'Decline Accept ';

    const openTic = await this.openTicket(
      {
        status: Status.Open,
        ticketId: confirm.ticketId,
      },
      userId,
      transaction,
    );
    const confirmTic = await this.ticketService.updateForSupport(
      confirm.ticketId,
      {
        isConfirm: true,
        updateBy: userId,
        statusId: openTic.statusId,
      },
      transaction,
    );

    CheckExisting(confirmTic[0], BadRequestException, {
      msg: 'Tickets Failed To Accept',
      trace: 'TicketsService.confirmTicket',
    });

    this.eventEmitter.emit(TICKET_EVENTS.CREATE, {
      userId,
      ticketId: confirm.ticketId,
    });

    return `Ticket with #${confirm.ticketId} Accepted`;
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
      ticket.status == Status.UnAssigned ||
      ticket.status === Status.Assigned
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
  async getLateSchedule() {
    const getSchedule = await this.trackingRepo.findAll({
      attributes: ['createdAt', 'comments'],
      include: [
        {
          model: TicketStatus,
          attributes: ['createdAt', 'id'],
          where: {
            status: {
              [Op.notLike]: Status.Scheduled,
            },
          },
        },
        {
          model: User,
          attributes: ['username', 'email', 'id'],
          as: 'staff',
          where: {
            status: {
              [Op.notLike]: Status.Scheduled,
            },
          },
        },
      ],
      where: {
        createdAt: {
          [Op.gt]: literal('`tracking`.`schedule_for` + INTERVAL 2 DAY '),
        },
      },
    });

    this.verifyEmailService.sendLateEmails(getSchedule);
    this.logger.log(`Get Schedule Ticket`);
    return getSchedule;
  }
}