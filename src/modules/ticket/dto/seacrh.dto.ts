import { Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchTicketDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @Transform((value) => new Date(value.value))
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @Transform((value) => new Date(value.value))
  @IsDate()
  endDate: Date;
}
