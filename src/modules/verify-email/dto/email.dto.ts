import {
  IsEmail,
  IsString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  fname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  lname: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
