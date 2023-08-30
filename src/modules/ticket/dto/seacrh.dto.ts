import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { STATUS } from 'src/common/types/Status.types';
import { ApiProperty } from '@nestjs/swagger';

export class SearchTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEnum(STATUS)
  @IsNotEmpty()
  status: STATUS;

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
