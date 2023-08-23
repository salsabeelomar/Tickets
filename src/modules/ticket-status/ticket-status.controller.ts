import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketStatusService } from './ticket-status.service';
import { CreateTicketStatusDto } from './dto/create-ticket-status.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

@Controller('ticket-status')
export class TicketStatusController {
  constructor(private readonly ticketStatusService: TicketStatusService) {}

  @Post()
  create(@Body() createTicketStatusDto: CreateTicketStatusDto) {
    return this.ticketStatusService.create(createTicketStatusDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketStatusDto: UpdateTicketStatusDto) {
    return this.ticketStatusService.update(+id, updateTicketStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketStatusService.remove(+id);
  }
}
