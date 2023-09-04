import { Injectable, Inject } from '@nestjs/common';
import { User } from '../user/models/user.model';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { UserService } from '../user/user.service';
import { CheckExisting } from 'src/common/utils/checkExisting';
import * as bcrypt from 'bcrypt';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './dto/generate-Token.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyEmailService } from 'src/modules/verify-email/verify-email.service';
import { Transaction } from 'sequelize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ROLES } from 'src/common/types/Roles.types';
import { StaffService } from '../support-staff/support-staff.service';

@Injectable()
export class AuthService {
  private readonly winstonLogger = new WinstonLogger();

  constructor(
    @Inject(PROVIDER.USER) private readonly userRepo: typeof User,
    private readonly userService: UserService,
    private readonly staffService: StaffService,
    private readonly verifyEmail: VerifyEmailService,
  ) {}
  async addUser(user: CreateAuthDto, transaction: Transaction) {
    const addUser = await this.userService.addUser(user, transaction);

    await this.verifyEmail.sendConfirmUser({
      lname: user.lname,
      fname: user.fname,
      email: user.email,
      token: this.userService.generateToken({
        ...addUser.user,
        isActive: true,
      }),
    });
    return {
      ...addUser,
      token: this.userService.generateToken({
        ...addUser.user,
        isActive: false,
      }),
    };
  }

  async signIn(user: LoginAuthDto, transaction: Transaction) {
    const getUser = await this.userService.getUserByEmail(user.email);

    CheckExisting(getUser, {
      msg: 'Email Not Existing',
      trace: 'AuthService.signUp',
    });

    const isMatch = bcrypt.compareSync(user.password, getUser.password);

    CheckExisting(isMatch, {
      msg: 'Email or Password not Correct',
      trace: 'AuthService.signIn',
    });
    const userData: UserToken = {
      id: getUser.id,
      username: getUser.username,
      email: getUser.email,
      isActive: getUser.isActive,
      role: getUser.role,
    };
    if (getUser.role === ROLES.SUPPORT_STAFF) {
      const staff = await this.staffService.findStaffByUserId(
        userData.id,
        transaction,
      );
      userData.staffId = staff.id;
    }

    this.winstonLogger.log(` User with ID=${getUser.id} Signed `);
    return {
      ...userData,
      token: this.userService.generateToken(userData),
    };
  }

  async verifyUser(token: string, transaction: Transaction) {
    const decoded = this.userService.verifyToken(token);
    const getUser = await this.userService.getUserById(decoded.sub);
    CheckExisting(getUser, {
      msg: 'User not Found ',
      trace: 'AuthService.verifyUser',
    });

    await this.userService.updateStatus(
      getUser.id,
      decoded.user.isActive,
      transaction,
    );

    return { msg: 'Email Verify Successfully ' };
  }
}
