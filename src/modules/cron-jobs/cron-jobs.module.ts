import { Module } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';
import { TicketProvider } from '../ticket/ticket.providers';
import { AssignmentProvider } from '../assignment-ticket/assignment-ticket.providers';
import { VerifyEmailService } from '../verify-email/verify-email.service';

@Module({
  providers: [
    CronJobsService,
    ...TicketProvider,
    ...AssignmentProvider,
    VerifyEmailService,
  ],
})
export class CronJobsModule {}
