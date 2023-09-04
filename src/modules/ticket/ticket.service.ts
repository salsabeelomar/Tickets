import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Transaction, Op } from 'sequelize';

import { PROVIDER } from 'src/common/constant/providers.constant';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { TICKET_EVENTS } from 'src/common/events/ticket.events';
import { STATUS } from 'src/common/types/Status.types';

import { User } from '../user/models/user.model';
import { TicketStatus } from '../ticket-status/models/ticket-status.model';
import { Ticket } from './models/ticket.model';

import { VerifyEmailService } from '../verify-email/verify-email.service';
import { SearchTicketDto } from './dto/seacrh.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UserToken } from '../auth/dto/generate-Token.dto';
import { ConfirmTicket } from './dto/confirm-ticket.dto';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { SupportStaff } from '../support-staff/models/support-staff.model';

@Injectable()
export class TicketService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.TICKET) private readonly ticketRepo: typeof Ticket,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(
    ticket: CreateTicketDto,
    user: UserToken,
    transaction: Transaction,
  ) {
    const newTicket = await this.ticketRepo.create(
      {
        ...ticket,
        userId: user.id,
        createdBy: user.id,
      },
      {
        transaction,
      },
    );
    this.logger.log(`Ticket is Created Successfully with Id =${newTicket.id}`);

    this.verifyEmailService.sendConfirmTicket({
      email: user.email,
      username: user.username,
      ticketId: newTicket.id,
    });
    return newTicket;
  }

  async findAll() {
    const getAllTicket = await this.ticketRepo.scope('basic').findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'staff',
          attributes: ['id', 'username'],
        },
        {
          model: TicketStatus,
          attributes: ['id', 'status'],
        },
      ],
      where: {
        isConfirm: true,
      },
    });
    this.logger.log(`Get All Tickets ${getAllTicket.length}`);
    return {
      Tickets: getAllTicket,
    };
  }
  async getUserTicket(userId: number) {
    const getAllTicket = await this.ticketRepo.scope('basic').findAll({
      include: [
        {
          model: TicketStatus,
          attributes: ['status'],
        },
      ],
      where: {
        userId,
      },
    });
    this.logger.log(`Get User Tickets with ID ${userId}`);
    return getAllTicket;
  }
  async updatedOneForUser(
    updated: UpdateTicketDto,
    userId: number,
    transaction: Transaction,
  ) {
    const getTicket = await this.getTicById(updated.id);

    CheckExisting(getTicket, {
      msg: 'Ticket Not Exist',
      trace: 'TicketService.UpdateOne',
    });
    await this.ticketRepo.update(
      {
        ...updated,
        updatedBy: userId,
      },
      {
        where: { id: updated.id, userId },
        transaction,
      },
    );
    this.logger.log(`Ticket With #${updated.id} Updated Successfully`);
    return `Ticket With #${updated.id} Updated Successfully`;
  }

  async updateForAdmin(
    id: number,
    staffId: number,
    adminId: number,
    transaction: Transaction,
  ) {
    const updateTic = await this.ticketRepo.update(
      {
        assignmentId: staffId,
        adminId,
        updatedBy: adminId,
      },
      {
        where: {
          id,
        },
        transaction,
      },
    );
    console.log(updateTic);
    this.logger.log(`Update the Ticket with Id ${id}`);

    return updateTic;
  }

  async update(att, condition, transaction: Transaction) {
    const updateTic = await this.ticketRepo.update(att, {
      where: condition,
      transaction,
    });
    this.logger.log(`Update the Ticket with Id ${condition.id}`);

    return updateTic;
  }

  async getTicById(id: number, transaction?: Transaction) {
    const getTic = await this.ticketRepo.scope('basic').findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'id', 'username'],
        },
        {
          model: TicketStatus,
          attributes: ['status'],
        },
      ],
    });
    this.logger.log(`Get Ticket with Id ${id}`);
    return getTic.toJSON();
  }
  async search(querySearch: SearchTicketDto, transaction: Transaction) {
    const searched = await this.ticketRepo.scope('basic').findAll({
      include: [
        {
          model: User,
          as: 'staff',
          attributes: ['id', 'username'],

          where: {
            username: {
              [Op.like]: `%${querySearch.username}%`,
            },
          },
        },
        {
          model: TicketStatus,
          attributes: ['id', 'status'],
          where: {
            status: querySearch.status,
          },
        },
      ],
      where: {
        createdAt: {
          [Op.between]: [querySearch.startDate, querySearch.endDate],
        },
        isConfirm: true,
      },
      transaction,
    });
    return searched;
  }
  async getOpenTic(transaction: Transaction) {
    const searched = await this.ticketRepo.scope('scope').findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
        {
          model: TicketStatus,
          attributes: ['id', 'status'],
          where: {
            status: STATUS.OPEN,
          },
        },
      ],
      where: {
        isConfirm: true,
      },
      transaction,
    });
    return { searched };
  }

  async getClosedTic(transaction?: Transaction) {
    const getTic = await this.ticketRepo.findAll({
      // attributes: ['id', 'title', 'description', 'statusId', 'createdAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'id', 'username'],
        },
        {
          model: TicketStatus,
          attributes: ['status'],

          // where: {
          //   status: { [Op.or]: [Status.Resolved, Status.Closed] },
          // },
        },
      ],

      transaction,
    });
    this.logger.log(`Get Ticket with Id`);
    return getTic;
  }

  async CheckConfirm(ticketId: number) {
    const checkCon = await this.ticketRepo.findByPk(ticketId, {
      attributes: ['isConfirm'],
      include: [
        {
          model: TicketStatus,
          attributes: ['status'],
        },
      ],
    });
    this.logger.log(`Checking the Ticket Is Confirmed ..`);

    return checkCon?.isConfirm;
  }

  async confirmTicket(
    confirm: ConfirmTicket,
    userId: number,
    transaction: Transaction,
  ) {
    if (!confirm.isConfirm) return 'Decline Accept ';

    // const openTic = await this.openTicket(
    //   {
    //     status: STATUS.OPEN,
    //     ticketId: confirm.ticketId,
    //   },
    //   userId,
    //   transaction,
    // );
    await this.updatedOneForUser(
      {
        id: confirm.ticketId,
        isConfirm: true,
      },
      userId,
      transaction,
    );

    this.eventEmitter.emit(TICKET_EVENTS.CREATE, {
      userId,
      ticketId: confirm.ticketId,
    });

    return `Ticket with #${confirm.ticketId} Accepted`;
  }
}
