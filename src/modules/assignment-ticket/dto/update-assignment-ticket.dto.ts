import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignmentDto } from './create-assignment-ticket.dto';

export class UpdateAssignmentTicketDto extends PartialType(CreateAssignmentDto) {}
