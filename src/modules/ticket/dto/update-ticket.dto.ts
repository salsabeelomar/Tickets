import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

enum AcceptConfirm {
  Accept = 'accept',
  Decline = 'decline',
}
export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsEnum(AcceptConfirm)
  @IsOptional()
  isConfirm?: AcceptConfirm ;
}
