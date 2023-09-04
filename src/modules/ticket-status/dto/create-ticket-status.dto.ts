import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
