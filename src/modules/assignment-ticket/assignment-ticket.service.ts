import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { CreateAssignmentDto } from './dto/create-assignment-ticket.dto';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { AssignmentTickets } from './models/assignment.model';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { TicketService } from '../ticket/ticket.service';
import { ASSIGNMENT } from 'src/common/types/Assignment.types';
import { TICKET_EVENTS } from 'src/common/events/ticket.events';
import { VerifyEmailService } from '../verify-email/verify-email.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StaffService } from '../support-staff/support-staff.service';

@Injectable()
export class AssignmentTicketService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.ASSIGNMENT_TICKET)
    private readonly assignmentRepo: typeof AssignmentTickets,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly StaffService: StaffService,
    private readonly eventEmitter: EventEmitter2,
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

    await this.ticketService.updateForAdmin(
      newAssignment.ticketId,
      newAssignment.staffId,
      adminId,
      transaction,
    );
    await this.notify(newAssignment.staffId, newAssignment.ticketId);
    return { data: { newAssignee: assignment }, msg: 'Assigned Success' };
  }

  async unAssign(
    newAssignment: CreateAssignmentDto,
    adminId: number,
    transaction: Transaction,
  ) {
    const check = await this.checkBeforeAssignment({
      ...newAssignment,
      assigned: ASSIGNMENT.ASSIGNED,
    });
    if (!check) return { msg: `Ticket Not assigned Yet` };

    const createAssignment = await this.assignmentRepo.create(
      { ...newAssignment, adminId },
      {
        transaction,
      },
    );

    await this.remove(
      newAssignment.ticketId,
      newAssignment.staffId,
      adminId,
      transaction,
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
    return { data: { newAssignee: createAssignment }, msg: 'Assigned Success' };
  }

  async checkBeforeAssignment(assignment: CreateAssignmentDto) {
    await this.ticketService.CheckConfirm(assignment.ticketId);

    const getAssignment = await this.assignmentRepo.scope('basic').findOne({
      where: {
        ...assignment,
      },
    });

    return getAssignment;
  }

  async remove(
    ticketId: number,
    staffId: number,
    adminId: number,
    transaction: Transaction,
  ) {
    await this.assignmentRepo.update(
      {
        deletedAt: new Date(),
        deletedBy: adminId,
      },
      {
        where: {
          assigned: ASSIGNMENT.ASSIGNED,
          ticketId,
          staffId,
          adminId,
        },
        transaction,
      },
    );
    return {
      msg: `Assignment with ticketId #${ticketId} Deleted Successfully`,
    };
  }
  async notify(staffId: number, ticketId: number) {
    const getNotified = await this.StaffService.findStaffById(staffId);

    this.eventEmitter.emit(TICKET_EVENTS.ASSIGNMENT, {
      notifiedId: getNotified.userId,
      ticketId,
      status: ASSIGNMENT.ASSIGNED,
    });

    return this.verifyEmailService.assignedTicket(getNotified.user);
  }
}
