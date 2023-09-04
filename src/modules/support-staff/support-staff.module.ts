import { Module } from '@nestjs/common';
import { StaffService } from './support-staff.service';
import { StaffController } from './support-staff.controller';
import { DatabaseModule } from '../database/database.module';
import { supportProvider } from './support-staff.provider';
import { UserModule } from '../user/user.module';
import { VerifyEmailService } from '../verify-email/verify-email.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [StaffController],
  providers: [StaffService, ...supportProvider, VerifyEmailService],
  exports: [StaffService, ...supportProvider, VerifyEmailService],
})
export class SupportStaffModule {}
