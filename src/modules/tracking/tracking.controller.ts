import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTracking } from './dto/create-tracking.dto';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { Transaction } from 'sequelize';
import { Role } from 'src/common/decorator/role.decorator';
import { ROLES } from 'src/common/types/Roles.types';
import { User } from 'src/common/decorator/user.decorator';
import { TransactionInter } from 'src/common/interceptor/Transaction.interceptor';
import { ConfirmTicket } from '../ticket/dto/confirm-ticket.dto';
import { GenerateToken } from '../auth/dto/generate-Token.dto';

@UseInterceptors(TransactionInter)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Role(ROLES.ADMIN, ROLES.SUPPORT_STAFF)
  @Post()
  create(
    @Body() ticketActions: CreateTracking,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.trackingService.matchStatus(ticketActions, user, trans);
  }
  @Role(ROLES.USER)
  @Get('confirm')
  confirm(
    @Query() confirm: ConfirmTicket,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.trackingService.confirmTicket(confirm, user.id, trans);
  }
}
