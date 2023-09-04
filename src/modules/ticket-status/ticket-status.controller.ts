import {
  Controller,
  UseInterceptors,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketStatusService } from './ticket-status.service';
import { CreateTicketStatusDto } from './dto/create-ticket-status.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { ROLES } from 'src/common/types/Roles.types';
import { Role } from 'src/common/decorator/role.decorator';
import { UserToken } from '../auth/dto/generate-Token.dto';
import { User } from 'src/common/decorator/user.decorator';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { Transaction } from 'sequelize';
import { TransactionInter } from 'src/common/interceptor/Transaction.interceptor';

@UseInterceptors(TransactionInter)
@Controller('ticket-status')
export class TicketStatusController {
  constructor(private readonly ticketStatusService: TicketStatusService) {}

  @Role(ROLES.USER, ROLES.ADMIN)
  @Post()
  create(
    @Body() createTicketStatusDto: CreateTicketStatusDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.ticketStatusService.create(
      createTicketStatusDto,
      user.id,
      trans,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTicketStatusDto: UpdateTicketStatusDto,
  ) {
    return this.ticketStatusService.update(+id, updateTicketStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketStatusService.remove(+id);
  }
}
