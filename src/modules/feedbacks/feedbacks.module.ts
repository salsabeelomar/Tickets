import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbackProvider } from './feedback.providers';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [TicketModule],
  controllers: [FeedbacksController],
  providers: [FeedbacksService, FeedbackProvider],
})
export class FeedbacksModule {}
