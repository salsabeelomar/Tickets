import { Module } from '@nestjs/common';
import { TicketStatusService } from './ticket-status.service';
import { TicketStatusController } from './ticket-status.controller';
import { TicketStatusProvider } from './ticket-status.providers';

@Module({
  controllers: [TicketStatusController],
  providers: [TicketStatusService, ...TicketStatusProvider],
  exports: [TicketStatusService, ...TicketStatusProvider],
})
export class TicketStatusModule {}
