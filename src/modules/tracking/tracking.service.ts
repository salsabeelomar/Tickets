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

  async matchStatus(
    addStatus: CreateTracking,
    user: UserToken,
    transaction: Transaction,
  ) {
    const checkConfirm = await this.ticketService.CheckConfirm(
      addStatus.ticketId,
    );

    CheckExisting(checkConfirm, {
      msg: "The Ticket isn't Confirmed or Closed ",
      trace: 'TrackingService.matchStatus',
    });

    // CheckExisting(
    //   !(
    //     user.role === ROLES.SUPPORT_STAFF &&
    //     (addStatus.status == STATUS.ASSIGNED ||
    //       addStatus.status == STATUS.UNASSIGNED)
    //   ),
    //   ForbiddenException,
    //   {
    //     msg: ' Staff tried to UnAssigned OR Assigned Ticket',
    //     trace: 'TrackingService.addStatus',
    //   },
    // );

    const roleId = `${user.role.toLowerCase()}Id`;

    if (
      addStatus.status == STATUS.ASSIGNED ||
      addStatus.status == STATUS.UNASSIGNED
    ) {
      return this.assignOrUnAssign(addStatus, user, transaction);
    }
    {
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
    }
    console.log({
      staffId: addStatus.assignedFor,
      [roleId]: user.id,
      updatedBy: user.id,
    });
    const updateStaff = await this.ticketService.updateForSupport(
      addStatus.ticketId,
      {
        staffId: addStatus.assignedFor,
        statusId: addStatus.statusId,
        [roleId]: user.id,
        updatedBy: user.id,
      },
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
    user: UserToken,
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

    await this.notify(
      {
        id: addStatus.ticketId,
        userId: addStatus.assignedFor,
        status: addStatus.status,
      },
      [],
      transaction,
    );

    return {
      status: addStatus.status,
      ticketId: addStatus.ticketId,
      actionId: action.id,
    };
  }

  async openTicket(
    addStatus: Omit<CreateTracking, 'statusId'>,
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
    CheckExisting(!checkCreated, {
      msg: ` this all ready exist in same staff and created By `,
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
        status: STATUS.OPEN,
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
