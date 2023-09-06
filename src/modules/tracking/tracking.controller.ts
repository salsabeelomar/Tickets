import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTracking } from './dto/create-tracking.dto';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { Transaction } from 'sequelize';
import { Role } from 'src/common/decorator/role.decorator';
import { ROLES } from 'src/common/types/Roles.types';
import { User } from 'src/common/decorator/user.decorator';
import { TransactionInter } from 'src/common/interceptor/Transaction.interceptor';
import { UserToken } from '../auth/dto/generate-Token.dto';

@UseInterceptors(TransactionInter)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Role(ROLES.ADMIN, ROLES.SUPPORT_STAFF)
  @Post()
  create(
    @Body() ticketActions: CreateTracking,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.trackingService.addTracking(ticketActions, user, trans);
  }
  @Role(ROLES.USER)
  @Post('open')
  confirm(
    @Body() openTic: CreateTracking,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.trackingService.openTicket(openTic, user.id, trans);
  }
}
