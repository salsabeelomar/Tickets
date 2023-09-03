import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { STAFF_STATUS } from 'src/common/types/staff-status.types';

export class CreateStaffDto {
  @IsEnum(STAFF_STATUS)
  @IsNotEmpty()
  status: STAFF_STATUS;

  @IsNumber()
  @IsNotEmpty()
  adminId: string;

  @IsNumber()
  @IsNotEmpty()
  userId: string;
}
