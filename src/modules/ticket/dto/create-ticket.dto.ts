import { IsNotEmpty, IsString } from 'class-validator';
import { Prioritize } from 'src/common/types/Prioritizae.types';
import { Category } from 'src/common/types/category.types';
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
  @IsString()
  @IsNotEmpty()
  prioritize: Prioritize;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tag: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: Category;
}
