import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { StaffService } from './support-staff.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ROLES } from 'src/common/types/Roles.types';
import { Role } from 'src/common/decorator/role.decorator';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { Transaction } from 'sequelize';
import { UserToken } from '../auth/dto/generate-Token.dto';
import { User } from 'src/common/decorator/user.decorator';
import { TransactionInter } from 'src/common/interceptor/Transaction.interceptor';
import { Public } from 'src/common/decorator/public.decorator';
import { NotActive } from 'src/common/decorator/isActive.decorator';
@UseInterceptors(TransactionInter)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Role(ROLES.ADMIN)
  @Post()
  async addStaff(
    @Body() staff: CreateAuthDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.staffService.signUpStaff(staff, user, trans);
  }

  @ApiOperation({ summary: 'Verify User Email' })
  @ApiResponse({ status: 200, description: 'Verify User Email' })
  @NotActive()
  @Public()
  @Get('invitation')
  async confirmStaff(
    @Query('token') token: string,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.staffService.verifyStaffInvitation(token, trans);
  }
}
