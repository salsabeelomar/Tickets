import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { ROLES } from 'src/common/types/Roles.types';

export class UserToken {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
  username: string;

  @IsEnum(ROLES)
  role: ROLES;
}
