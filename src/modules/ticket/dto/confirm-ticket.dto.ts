import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

enum AcceptConfirm {
  Accept = 'accept',
  Decline = 'decline',
}
import { ApiProperty } from '@nestjs/swagger';
export class ConfirmTicket {
  @ApiProperty()
  @IsEnum(AcceptConfirm)
  @IsNotEmpty()
  isConfirm: AcceptConfirm;

  @ApiProperty()
  @Transform((value) => {
    return parseInt(value.value);
  })
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ticketId: number;
}
