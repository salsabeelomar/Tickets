import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Status } from 'src/common/types/status.types';

export class SearchTicketDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @Transform((value) => new Date(value.value))
  @IsDate()
  @IsNotEmpty()
  startDate: Date;
  
  @Transform((value) => new Date(value.value))
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}
