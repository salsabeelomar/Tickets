import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from '../user/entities/user.entity';
import { Providers } from 'src/common/constant/providers.constant';
import { UserService } from '../user/user.service';
import { CheckExisting } from 'src/common/utils/checkExisting';
import * as bcrypt from 'bcrypt';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { JwtService } from '@nestjs/jwt';
import { GenerateToken } from './dto/generate-Token.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyEmailService } from 'src/modules/verify-email/verify-email.service';
import { Transaction } from 'sequelize';
import { Roles } from 'src/common/types/Roles.types';

@Injectable()
export class AuthService {
  private readonly winstonLogger = new WinstonLogger();

  constructor(
    @Inject(Providers.USER) private readonly userRepo: typeof User,
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly verifyEmail: VerifyEmailService,
  ) {}

  async signIn(user: LoginAuthDto, transaction: Transaction) {
    const getEmail = await this.userService.getUserByEmail(user.email);

    CheckExisting(getEmail, BadRequestException, {
      msg: 'Email Not Existing',
      trace: 'AuthService.signUp',
    });
    const getPass = await this.userRepo.findByPk(getEmail.id, {
      attributes: ['id', 'password', 'email', 'username', 'role', 'isActive'],
      transaction,
    });
    const isMatch = bcrypt.compareSync(user.password, getPass.password);

    CheckExisting(isMatch, BadRequestException, {
      msg: 'Email or Password not Correct',
      trace: 'AuthService.signIn',
    });
    const userData: GenerateToken = {
      id: getPass.id,
      username: getPass.username,
      email: getPass.email,
      isActive: getPass.isActive,
      role: getPass.role,
    };

    this.winstonLogger.log(` User with ID=${getPass.id} Signed `);
    return {
      ...userData,
      token: this.userService.generateToken(userData),
    };
  }

  async signUp(user: CreateAuthDto, transaction: Transaction) {
    const getEmail = await this.userService.getUserByEmail(user.email);

    CheckExisting(!getEmail, BadRequestException, {
      msg: 'Email is Existing',
      trace: 'AuthService.signUp',
    });

    const hashPass = bcrypt.hashSync(user.password, 10);

    const newUser = await this.userRepo.create(
      {
        ...user,
        password: hashPass,
      },
      {
        transaction,
      },
    );

    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    await this.verifyEmail.sendConfirmUser({
      lname: user.lname,
      fname: user.fname,
      email: user.email,
      token: this.userService.generateToken({ ...userData, isActive: true }),
    });

    this.winstonLogger.log(`Create New User with ID=${newUser.id}`);

    return {
      ...userData,
      token: this.userService.generateToken({ ...userData, isActive: false }),
    };
  }

  async verifyUser(
    token: string,
    transaction: Transaction,
    toActivate?: boolean,
  ) {
    const decoded = this.verifyToken(token);
    const getUser = await this.userService.getUserById(decoded.sub);

    if (getUser?.email && toActivate && decoded.user.isActive) {
      const updateUser = await this.userRepo.update(
        {
          isActive: true,
          updatedBy: decoded.sub,
        },
        {
          where: { id: decoded.sub },
          transaction,
        },
      );
      CheckExisting(updateUser[0], BadRequestException, {
        msg: 'Failed To Activate the Account',
        trace: 'AuthService.verifyUser',
      });
      return 'Email Verify Successfully ';
    } else if (
      decoded.user.isActive === false &&
      decoded.user.role === Roles.Support_Staff
    ) {
      const deleteStaff = await this.userService.removeUser(
        decoded.sub,
        decoded.sub,
        transaction,
      );
      CheckExisting(deleteStaff[0], BadRequestException, {
        msg: 'Failed To Delete Staff',
        trace: 'AuthService.verifyUser',
      });

      return 'Staff Deleted Successfully ';
    }
  }

  verifyToken(token: string) {
    try {
      const decoded = this.jwt.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
