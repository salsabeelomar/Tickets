import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { CONFIRMATION } from 'src/common/types/Active.types';
export class ConfirmTicket {
  @ApiProperty()
  @IsEnum(CONFIRMATION)
  @IsNotEmpty()
  isConfirm: CONFIRMATION;

  @ApiProperty()
  @Transform((value) => {
    return parseInt(value.value);
  })
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ticketId: number;
}
