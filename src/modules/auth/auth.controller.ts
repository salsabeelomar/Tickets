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
import { Transaction } from 'sequelize';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { TransactionInter } from 'src/common/interceptor/Transaction.interceptor';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ROLES } from 'src/common/types/Roles.types';
@ApiTags('Auth')
@UseInterceptors(TransactionInter)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign Up new User' })
  @ApiResponse({ status: 200, description: 'Sign Up new User' })
  @NotActive()
  @Public()
  @Post('signup')
  signUp(
    @Body() createAuthDto: CreateAuthDto,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.authService.addUser(createAuthDto, trans);
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

  @ApiOperation({ summary: 'Sign In User' })
  @ApiResponse({ status: 200, description: 'Sign In User' })
  @NotActive()
  @Public()
  @Get('activate')
  async confirmEmail(
    @Query('token') token: string,
    @TransactionDeco() trans: Transaction,
  ) {
    return await this.authService.verifyUser(token, trans);
  }
}
