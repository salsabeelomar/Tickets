import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ConfirmTic {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  ticketId: number;

  @IsString()
  @IsNotEmpty()
  username: string;
}
