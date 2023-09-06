import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchAssigneeDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @Transform((value) => new Date(value.value))
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @ApiProperty()
  @Transform((value) => new Date(value.value))
  @IsDate()
  @IsOptional()
  endDate?: Date;
}
