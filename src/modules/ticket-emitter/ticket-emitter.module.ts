import { Module } from '@nestjs/common';
import { TicketEmitterService } from './ticket-emitter.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [TicketEmitterService],
  exports: [TicketEmitterService],
})
export class TicketEmitterModule {}
