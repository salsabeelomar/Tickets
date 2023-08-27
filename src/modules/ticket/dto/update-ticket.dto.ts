import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum AcceptConfirm {
  Accept = 'accept',
  Decline = 'decline',
}
export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsEnum(AcceptConfirm)
  @IsOptional()
  isConfirm?: AcceptConfirm;
}
