import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ASSIGNMENT } from 'src/common/types/Assignment.types';

export class CreateAssignmentDto {
  @IsNumber()
  @IsNotEmpty()
  ticketId: number;

  @IsNumber()
  @IsNotEmpty()
  staffId: number;

  @IsEnum(ASSIGNMENT)
  @IsNotEmpty()
  assigned: ASSIGNMENT;
}
