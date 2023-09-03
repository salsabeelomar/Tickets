import { Transform } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ROLES } from 'src/common/types/Roles.types';
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
  @IsEnum(ROLES)
  @IsNotEmpty()
  role: ROLES;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
