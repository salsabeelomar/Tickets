import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PRIORITIZE } from 'src/common/types/Prioritize.types';
import { CATEGORY } from 'src/common/types/category.types';
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
  @IsString()
  @IsNotEmpty()
  tag: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
