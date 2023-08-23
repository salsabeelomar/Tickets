import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketStatusDto } from './create-ticket-status.dto';
import { IsNumber } from 'class-validator';

export class UpdateTicketStatusDto extends PartialType(CreateTicketStatusDto) {
  @IsNumber()
  id: number;
}
