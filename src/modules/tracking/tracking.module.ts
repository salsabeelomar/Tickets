import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { DatabaseModule } from '../database/database.module';
import { TrackingProvider } from './tracking.providers';
import { TicketStatusModule } from '../ticket-status/ticket-status.module';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [
    DatabaseModule,
    TicketStatusModule,
    TicketModule,
  ],
  controllers: [TrackingController],
  providers: [TrackingService, TrackingProvider],
  exports: [TrackingService, TrackingProvider],
})
export class TrackingModule {}
