import { Injectable, Inject } from '@nestjs/common';

import { WinstonLogger } from 'src/common/logger/winston.logger';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { Transaction } from 'sequelize';
import { CheckExisting } from 'src/common/utils/checkExisting';
import * as bcrypt from 'bcrypt';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { UserService } from '../user/user.service';
import { VerifyEmailService } from '../verify-email/verify-email.service';
import { User } from '../user/models/user.model';

@Injectable()
export class DashboardService {
  private readonly winstonLogger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.USER) private readonly userRepo: typeof User,
    private readonly userService: UserService,
    private readonly verifyEmail: VerifyEmailService,
  ) {}
  async addStaff(
    staff: CreateAuthDto,
    userId: number,
    transaction: Transaction,
  ) {
    const getEmail = await this.userService.getUserByEmail(staff.email);

    CheckExisting(!getEmail, {
      msg: 'Email is Existing',
      trace: 'AuthService.signUp',
    });
    const hashPass = bcrypt.hashSync(staff.password, 10);
    const newStaff = await this.userRepo.create(
      {
        ...staff,
        password: hashPass,
        createdBy: userId,
        isActive: false,
      },
      {
        transaction,
      },
    );

    const staffData = {
      id: newStaff.id,
      username: newStaff.username,
      email: newStaff.email,
      role: newStaff.role,
    };

    await this.verifyEmail.sendConfirmStaff({
      email: newStaff.email,
      activeToken: this.userService.generateToken({
        ...staffData,
        isActive: true,
      }),
      declineToken: this.userService.generateToken({
        ...staffData,
        isActive: false,
      }),
    });

    this.winstonLogger.log('Waiting Staff To Accept Invitation');

    return {
      msg: 'Waiting To Accept Invitation ',
    };
  }

  async remove(id: number, userId: number, transaction: Transaction) {
    const removedUser = await this.userService.removeUser(
      id,
      userId,
      transaction,
    );

    return 'Staff Deleted Successfully ';
  }
}
