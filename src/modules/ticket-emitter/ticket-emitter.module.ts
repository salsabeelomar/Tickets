import { Module } from '@nestjs/common';
import { TicketEmitterService } from './ticket-emitter.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [EventEmitterModule.forRoot(), NotificationModule],
  providers: [TicketEmitterService],
  exports: [TicketEmitterService],
})
export class TicketEmitterModule {}
