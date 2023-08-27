import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ticketId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  feedback: string;

  @ApiProperty()
  @IsNumber()
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  rating: number;
}
