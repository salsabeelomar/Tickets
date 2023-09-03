import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { STAFF_STATUS } from 'src/common/types/staff-status.types';

export class UpdateStaffDto {
  @IsEnum(STAFF_STATUS)
  @IsNotEmpty()
  status: STAFF_STATUS;

  @IsNumber()
  @IsNotEmpty()
  id: number;
}
