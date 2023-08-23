import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { NotActive } from 'src/common/decorator/isActive.decorator';
import { Role } from 'src/common/decorator/role.decorator';
import { Roles } from 'src/common/types/Roles.types';
import { User } from 'src/common/decorator/user.decorator';
import { Transaction } from 'sequelize';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { TransactionInter } from 'src/common/interceptor/Transaction.interceptor';

@UseInterceptors(TransactionInter)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @NotActive()
  @Public()
  @Post('signup')
  signUp(
    @Body() createAuthDto: CreateAuthDto,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.authService.signUp(createAuthDto, trans);
  }

  @NotActive()
  @Public()
  @Post('signIn')
  signIn(
    @Body() loginAuthDto: LoginAuthDto,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.authService.signIn(loginAuthDto, trans);
  }

  @NotActive()
  @Public()
  @Get('confirm')
  async confirmEmail(
    @Query('token') token: string,
    @TransactionDeco() trans: Transaction,
  ) {
    return await this.authService.verifyUser(token, trans, true);
  }


    @NotActive()
    @Public()
    @Get('add-staff')
    async confirmStaff(
      @Query('token') token: string,
      @TransactionDeco() trans: Transaction,
    ) {
      return await this.authService.verifyUser(token, trans, true);
    }
}
