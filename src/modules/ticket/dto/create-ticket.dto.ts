import { IsNotEmpty, IsString } from 'class-validator';
import { Prioritize } from 'src/common/types/Prioritizae.types';
import { Category } from 'src/common/types/category.types';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  prioritize: Prioritize;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsString()
  @IsNotEmpty()
  category: Category;
}
