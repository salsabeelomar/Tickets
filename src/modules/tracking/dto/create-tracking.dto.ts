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

export class CreateTracking {
  @IsNumber()
  @IsNotEmpty()
  ticketId: number;

  @IsNumber()
  @IsOptional()
  statusId?: number;

  @IsEnum(Status)
  status: Status = Status.Open;

  @IsNumber()
  @IsOptional()
  assignedFor?: number;

  @Transform((value) => new Date(value.value))
  @IsDate()
  @IsOptional()
  scheduleFor?: Date;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  comments?: string[];
}
