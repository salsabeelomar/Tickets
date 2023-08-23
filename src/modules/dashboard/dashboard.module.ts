import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UserModule } from '../user/user.module';
import { VerifyEmailService } from '../verify-email/verify-email.service';

@Module({
  imports: [UserModule],
  controllers: [DashboardController],
  providers: [DashboardService, VerifyEmailService],
})
export class DashboardModule {}
