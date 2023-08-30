import { Module } from '@nestjs/common';
import { AssignmentTicketService } from './assignment-ticket.service';
import { AssignmentTicketController } from './assignment-ticket.controller';

@Module({
  controllers: [AssignmentTicketController],
  providers: [AssignmentTicketService],
})
export class AssignmentTicketModule {}
