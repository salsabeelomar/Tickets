import {
  Controller,
  ParseIntPipe,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Role } from 'src/common/decorator/role.decorator';
import { Roles } from 'src/common/types/Roles.types';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { User } from 'src/common/decorator/user.decorator';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { Transaction } from 'sequelize';
import { GenerateToken } from '../auth/dto/generate-Token.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post('add-staff')
  @Role(Roles.Admin)
  @Post('add-staff')
  async addStaff(
    @Body() staff: CreateAuthDto,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return await this.dashboardService.addStaff(staff, user.id, trans);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.dashboardService.remove(id, user.id, trans);
  }
}
