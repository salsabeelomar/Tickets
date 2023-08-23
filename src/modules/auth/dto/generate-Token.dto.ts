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
import { Roles } from 'src/common/types/Roles.types';

export class GenerateToken {
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

  @IsEnum(Roles)
  role: Roles;
}
