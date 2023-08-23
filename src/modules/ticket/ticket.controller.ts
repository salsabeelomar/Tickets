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
import { Roles } from 'src/common/types/Roles.types';
import { SearchTicketDto } from './dto/seacrh.dto';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GenerateToken } from '../auth/dto/generate-Token.dto';

@UseInterceptors(CacheInterceptor)
@UseInterceptors(TransactionInter)
@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Role(Roles.User)
  @Post()
  create(
    @Body() createTicketDto: CreateTicketDto,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.ticketService.create(createTicketDto, user, trans);
  }

  @Role(Roles.Support_Staff, Roles.Admin)
  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Role(Roles.Support_Staff, Roles.User)
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

  @Role(Roles.Support_Staff)
  @Get('search')
  search(
    @Query() query: SearchTicketDto,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.ticketService.search(query, trans);
  }

  @Role(Roles.User)
  @Patch(':id')
  updatedOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateTicketDto: UpdateTicketDto,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.ticketService.updatedOne(
      { id, ...updateTicketDto },
      user.id,
      trans,
    );
  }
}
