import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignmentTicketDto } from './create-assignment-ticket.dto';

export class UpdateAssignmentTicketDto extends PartialType(CreateAssignmentTicketDto) {}
