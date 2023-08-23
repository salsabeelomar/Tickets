import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

enum AcceptConfirm {
  Accept = 'accept',
  Decline = 'decline',
}
export class ConfirmTicket {
  @IsEnum(AcceptConfirm)
  @IsNotEmpty()
  isConfirm: AcceptConfirm;

  @Transform((value) => {
    return parseInt(value.value);
  })
  @IsNumber()
  @IsNotEmpty()
  ticketId: number;
}
