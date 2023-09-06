import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  ParseIntPipe,
  Query,
  Inject,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { Transaction } from 'sequelize';
import { TransactionInter } from 'src/common/interceptor/Transaction.interceptor';
import { Role } from 'src/common/decorator/role.decorator';
import { ROLES } from 'src/common/types/Roles.types';
import { SearchTicketDto } from './dto/seacrh.dto';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserToken } from '../auth/dto/generate-Token.dto';
import { ConfirmTicket } from './dto/confirm-ticket.dto';
import { SearchAssigneeDto } from './dto/search-assignee.dto';
import { SearchStatusDto } from './dto/search-status.dto';
import { NotActive } from 'src/common/decorator/isActive.decorator';

@UseInterceptors(TransactionInter)
@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Role(ROLES.USER)
  @Post()
  create(
    @Body() createTicketDto: CreateTicketDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.ticketService.create(createTicketDto, user, trans);
  }

  @UseInterceptors(CacheInterceptor)
  @Role(ROLES.SUPPORT_STAFF, ROLES.ADMIN)
  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Role(ROLES.SUPPORT_STAFF, ROLES.USER)
  @Get('open-ticket')
  async openTicket(@TransactionDeco() trans: Transaction) {
    const opened = await this.cacheManager.get('open-ticket');
    if (opened) {
      return opened;
    }
    const getOpened = await this.ticketService.getOpenTic(trans);

    await this.cacheManager.set('open-ticket', getOpened);
    return getOpened;
  }

  @NotActive()
  @Get('search/assignee')
  searchAssignee(
    @Query() searchAssigneeDto: SearchAssigneeDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.ticketService.searchAssignee(searchAssigneeDto, trans);
  }
  @NotActive()
  @Get('search/status')
  searchS(
    @Query() searchStatusDto: SearchStatusDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.ticketService.searchByStatus(searchStatusDto, trans);
  }
  @NotActive()
  @Get('search')
  search(
    @Query() query: SearchTicketDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.ticketService.search(query, trans);
  }

  @Role(ROLES.USER)
  @Patch(':id')
  updatedOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateTicketDto: UpdateTicketDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.ticketService.updatedOneForUser(
      { id, ...updateTicketDto },
      user.id,
      trans,
    );
  }

  @Get('resolved-issues')
  getResolved(@User() user: UserToken, @TransactionDeco() trans: Transaction) {
    return this.ticketService.getClosedTic(trans);
  }
  @Role(ROLES.USER)
  @Get('confirm')
  confirm(
    @Query() confirm: ConfirmTicket,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.ticketService.confirmTicket(confirm, user.id, trans);
  }
}
