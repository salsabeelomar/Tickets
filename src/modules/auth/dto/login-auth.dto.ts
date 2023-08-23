import {
    IsEmail,
    IsString,
    MaxLength,
    MinLength,   
    IsNotEmpty,
  } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
