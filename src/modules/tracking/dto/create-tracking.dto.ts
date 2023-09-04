import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { STATUS } from 'src/common/types/Status.types';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTracking {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ticketId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  statusId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  assignedFor?: number;

  @ApiProperty()
  @Transform((value) => new Date(value.value))
  @IsDate()
  @IsOptional()
  scheduleFor?: Date;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  comments?: string[];
}
