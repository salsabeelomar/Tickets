import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketProvider } from './ticket.providers';
import { DatabaseModule } from '../database/database.module';
import { VerifyEmailService } from '../verify-email/verify-email.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TicketController],
  providers: [TicketService, TicketProvider, VerifyEmailService,],
  exports: [TicketService, TicketProvider, VerifyEmailService],
})
export class TicketModule {}
