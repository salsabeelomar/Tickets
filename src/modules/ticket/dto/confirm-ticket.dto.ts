import { Transform } from 'class-transformer';
import { IsBooleanString, IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class ConfirmTicket {
  @ApiProperty()
  @IsNotEmpty()
  @IsBooleanString()
  isConfirm: boolean;

  @Transform((value) => Number(value.value))
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ticketId: number;
}
