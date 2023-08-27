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
import { Status } from 'src/common/types/status.types';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTracking {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ticketId: number;

  @ApiProperty()
  @IsNumber()
  statusId: number;

  @ApiProperty()
  @IsEnum(Status)
  status: Status = Status.Open;

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
