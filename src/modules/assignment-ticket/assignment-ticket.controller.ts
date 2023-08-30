import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssignmentTicketService } from './assignment-ticket.service';
import { CreateAssignmentTicketDto } from './dto/create-assignment-ticket.dto';
import { UpdateAssignmentTicketDto } from './dto/update-assignment-ticket.dto';

@Controller('assignment-ticket')
export class AssignmentTicketController {
  constructor(private readonly assignmentTicketService: AssignmentTicketService) {}

  @Post()
  create(@Body() createAssignmentTicketDto: CreateAssignmentTicketDto) {
    return this.assignmentTicketService.create(createAssignmentTicketDto);
  }

  @Get()
  findAll() {
    return this.assignmentTicketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentTicketService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssignmentTicketDto: UpdateAssignmentTicketDto) {
    return this.assignmentTicketService.update(+id, updateAssignmentTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentTicketService.remove(+id);
  }
}
