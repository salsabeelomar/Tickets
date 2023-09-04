import { Module } from '@nestjs/common';
import { TicketStatusService } from './ticket-status.service';
import { TicketStatusController } from './ticket-status.controller';
import { TicketStatusProvider } from './ticket-status.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TicketStatusController],
  providers: [TicketStatusService, ...TicketStatusProvider],
  exports: [TicketStatusService, ...TicketStatusProvider],
})
export class TicketStatusModule {}
