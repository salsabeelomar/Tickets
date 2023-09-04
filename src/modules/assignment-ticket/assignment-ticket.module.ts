import { Module } from '@nestjs/common';
import { AssignmentTicketService } from './assignment-ticket.service';
import { AssignmentTicketController } from './assignment-ticket.controller';
import { AssignmentProvider } from './assignment-ticket.providers';
import { DatabaseModule } from '../database/database.module';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [DatabaseModule, TicketModule],
  controllers: [AssignmentTicketController],
  providers: [AssignmentTicketService, ...AssignmentProvider],
  exports: [AssignmentTicketService, ...AssignmentProvider],
})
export class AssignmentTicketModule {}
