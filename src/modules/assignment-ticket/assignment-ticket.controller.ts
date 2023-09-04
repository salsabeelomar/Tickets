import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { AssignmentTicketService } from './assignment-ticket.service';
import { CreateAssignmentDto } from './dto/create-assignment-ticket.dto';
import { UpdateAssignmentTicketDto } from './dto/update-assignment-ticket.dto';
import { ROLES } from 'src/common/types/Roles.types';
import { Role } from 'src/common/decorator/role.decorator';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { Transaction } from 'sequelize';
import { TransactionInter } from 'src/common/interceptor/Transaction.interceptor';
import { User } from 'src/common/decorator/user.decorator';
import { UserToken } from '../auth/dto/generate-Token.dto';

@UseInterceptors(TransactionInter)
@Controller('assignment-ticket')
export class AssignmentTicketController {
  constructor(
    private readonly assignmentTicketService: AssignmentTicketService,
  ) {}

  @Role(ROLES.ADMIN)
  @Post('assign')
  assign(
    @Body() createAssignment: CreateAssignmentDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.assignmentTicketService.assign(
      createAssignment,
      user.id,
      trans,
    );
  }
  @Role(ROLES.ADMIN)
  @Post('assign')
  unassign(
    @Body() createAssignment: CreateAssignmentDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.assignmentTicketService.unAssign(
      createAssignment,
      user.id,
      trans,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentTicketService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssignmentTicketDto: UpdateAssignmentTicketDto,
  ) {
    return this.assignmentTicketService.update(+id, updateAssignmentTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentTicketService.remove(+id);
  }
}
