import { Module } from '@nestjs/common';
import { StaffService } from './support-staff.service';
import { StaffController } from './support-staff.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StaffController],
  providers: [StaffService],
})
export class SupportStaffModule {}
