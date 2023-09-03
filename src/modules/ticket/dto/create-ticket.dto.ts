import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PRIORITIZE } from 'src/common/types/Prioritize.types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsEnum(PRIORITIZE)
  @IsNotEmpty()
  prioritize: PRIORITIZE;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tagId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
