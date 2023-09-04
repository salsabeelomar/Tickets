import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { CreateAssignmentDto } from './dto/create-assignment-ticket.dto';
import { UpdateAssignmentTicketDto } from './dto/update-assignment-ticket.dto';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { AssignmentTickets } from './models/assignment.model';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { TicketService } from '../ticket/ticket.service';
import { ASSIGNMENT } from 'src/common/types/Assignment.types';
import { VerifyEmailService } from '../verify-email/verify-email.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserService } from '../user/user.service';

@Injectable()
export class AssignmentTicketService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.ASSIGNMENT_TICKET)
    private readonly assignmentRepo: typeof AssignmentTickets,
    private readonly ticketService: TicketService,
  ) {}
  async create(
    newAssignment: CreateAssignmentDto,
    adminId: number,
    transaction: Transaction,
  ) {
    const createAssignment = await this.assignmentRepo.create(
      { ...newAssignment, adminId, createdBy: adminId },
      {
        transaction,
      },
    );

    this.logger.log(
      `Admin Assign Ticket with #${newAssignment.ticketId} to #${newAssignment.staffId}`,
    );
    return createAssignment;
  }

  async assign(
    newAssignment: CreateAssignmentDto,
    adminId: number,
    transaction: Transaction,
  ) {
    const confirmationTic = await this.ticketService.CheckConfirm(
      newAssignment.ticketId,
    );
    if (!confirmationTic)
      throw new BadRequestException('Ticket Not Confirmed Yet');

    const assignment = await this.create(newAssignment, adminId, transaction);
;
    await this.ticketService.updateForAdmin(
      newAssignment.ticketId,
      newAssignment.staffId,
      adminId,
      transaction,
    );
    return assignment;
  }

  async unAssign(
    newAssignment: CreateAssignmentDto,
    adminId: number,
    transaction: Transaction,
  ) {
    const check = await this.checkAssign(
      { ...newAssignment, assigned: ASSIGNMENT.ASSIGNED },
      transaction,
    );
    if (!check) return { msg: `Ticket Not assigned Yet` };

    const createAssignment = await this.assignmentRepo.create(
      { ...newAssignment, adminId },
      {
        transaction,
      },
    );

    await this.ticketService.updateForAdmin(
      newAssignment.ticketId,
      null,
      adminId,
      transaction,
    );
    this.logger.log(
      `Admin Assign Ticket with #${newAssignment.ticketId} to #${newAssignment.staffId}`,
    );
    return createAssignment;
  }

  async checkAssign(assignment: CreateAssignmentDto, transaction: Transaction) {
    const confirmationTic = await this.ticketService.CheckConfirm(
      assignment.ticketId,
    );
    if (!confirmationTic)
      throw new BadRequestException('Ticket Not Confirmed Yet');

    const getAssignment = await this.assignmentRepo.scope('basic').findOne({
      where: {
        ...assignment,
      },
    });
    return getAssignment;
  }
  findOne(id: number) {
    return `This action returns a #${id} assignmentTicket`;
  }

  update(id: number, updateAssignmentTicketDto: UpdateAssignmentTicketDto) {
    return `This action updates a #${id} assignmentTicket`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignmentTicket`;
  }
  async notify() {
    //   const getNotified = await this.eventEmitter.emit(TICKET_EVENTS.ASSIGNMENT, {
    //     notifiedId: ticInfo.staff.id,
    //     ticketId: ticket.id,
    //     status: ticket.status,
    //   });
    //   return this.verifyEmailService.sendUpdateTicket(ticket.status, {
    //     ...ticInfo.toJSON().staff,
    //     title: ticInfo.title,
    //   });
  }
}
