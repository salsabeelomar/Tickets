import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class ResponseTick {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}
