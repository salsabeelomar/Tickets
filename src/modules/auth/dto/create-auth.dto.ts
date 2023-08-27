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
import { ApiProperty } from '@nestjs/swagger';
export class CreateAuthDto extends LoginAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  fname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  lname: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Transform((value) => new Date(value.value as string))
  birthday: Date;

  @ApiProperty()
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
