import { Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchStatusDto {
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
