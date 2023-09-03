import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { CreateAssignmentDto } from './dto/create-assignment-ticket.dto';
import { UpdateAssignmentTicketDto } from './dto/update-assignment-ticket.dto';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { AssignmentTickets } from './models/assignment.model';
import { PROVIDER } from 'src/common/constant/providers.constant';

@Injectable()
export class AssignmentTicketService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.ASSIGNMENT_TICKET)
    private readonly assignmentRepo: typeof AssignmentTickets,
  ) {}
  async create(
    newAssignment: CreateAssignmentDto,
    adminId: number,
    transaction: Transaction,
  ) {
    const createAssignment = await this.assignmentRepo.create(
      { ...newAssignment, adminId },
      {
        transaction,
      },
    );

    this.logger.log(`Admin Assign Ticket with #${newAssignment.ticketId} to #${newAssignment.staffId}`);
    return createAssignment;
  }

  findAll() {
    return `This action returns all assignmentTicket`;
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
}
