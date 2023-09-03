import { Module } from '@nestjs/common';
import { StaffService } from './support-staff.service';
import { StaffController } from './support-staff.controller';
import { DatabaseModule } from '../database/database.module';
import { supportProvider } from './support-staff.provider';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [StaffController],
  providers: [StaffService, ...supportProvider],
})
export class SupportStaffModule {}
