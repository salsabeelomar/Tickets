import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Status } from 'src/common/types/status.types';
import { ApiProperty } from '@nestjs/swagger';

export class SearchTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty()
  @Transform((value) => new Date(value.value))
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @Transform((value) => new Date(value.value))
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}
