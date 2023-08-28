import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { CreateTracking } from './dto/create-tracking.dto';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { Transaction } from 'sequelize';
import { Role } from 'src/common/decorator/role.decorator';
import { Roles } from 'src/common/types/Roles.types';
import { User } from 'src/common/decorator/user.decorator';
import { TransactionInter } from 'src/common/interceptor/Transaction.interceptor';
import { ConfirmTicket } from '../ticket/dto/confirm-ticket.dto';
import { GenerateToken } from '../auth/dto/generate-Token.dto';

@UseInterceptors(TransactionInter)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Role(Roles.Admin, Roles.Support_Staff)
  @Post()
  create(
    @Body() ticketActions: CreateTracking,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    
    return this.trackingService.matchStatus(ticketActions, user, trans);
  }
  @Role(Roles.User)
  @Get('confirm')
  confirm(
    @Query() confirm: ConfirmTicket,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.trackingService.confirmTicket(confirm, user.id, trans);
  }
}
