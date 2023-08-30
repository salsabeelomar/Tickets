import { Injectable } from '@nestjs/common';
import { CreateAssignmentTicketDto } from './dto/create-assignment-ticket.dto';
import { UpdateAssignmentTicketDto } from './dto/update-assignment-ticket.dto';

@Injectable()
export class AssignmentTicketService {
  create(createAssignmentTicketDto: CreateAssignmentTicketDto) {
    return 'This action adds a new assignmentTicket';
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
