import { Transform } from 'class-transformer';
import {

  IsString,
  MaxLength,
  IsDate,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Roles } from 'src/common/types/Roles.types';
import { LoginAuthDto } from './login-auth.dto';

export class CreateAuthDto extends LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  fname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  lname: string;

  @IsDate()
  @IsNotEmpty()
  @Transform((value) => new Date(value.value as string))
  birthday: Date;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
