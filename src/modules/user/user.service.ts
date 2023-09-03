import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { User } from './models/user.model';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { UserToken } from '../auth/dto/generate-Token.dto';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from 'sequelize';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly winstonLogger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.USER) private readonly userRepo: typeof User,
    private readonly jwt: JwtService,
  ) {}

  async addUser(user: CreateAuthDto, transaction: Transaction) {
    const getUser = await this.getUserByEmail(user.email);

    CheckExisting(!getUser, {
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
        returning: ['id', 'username', 'email', 'role'],
        transaction,
      },
    );

    this.winstonLogger.log(`Create New User with ID=${newUser.id}`);

    return {
      user: { ...newUser.toJSON() },
    };
  }

  async getUserByEmail(email: string) {
    const getUser = await this.userRepo.findOne({
      where: {
        email,
      },
    });
    this.winstonLogger.log(`Get User with Email ${email}`);
    return getUser;
  }

  generateToken(user: UserToken) {
    const payload = {
      sub: user.id,
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      },
    };
    this.winstonLogger.log(`Generate Token  for user id = ${user.id}`);

    return this.jwt.sign(payload);
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findByPk(id, {
      attributes: ['id', 'role', 'username', 'email', 'isActive'],
    });
    CheckExisting(user.email, {
      msg: 'User Not Found',
      trace: 'User.service',
    });
    return user.toJSON();
  }

  async removeUser(id: number, userId: number, transaction: Transaction) {
    const deleteStaff = await this.userRepo.update(
      {
        isActive: false,
        deletedAt: new Date(),
        deletedBy: id,
      },
      {
        where: { id: userId },
        transaction,
      },
    );
    this.winstonLogger.warn(`Delete User with ID ${id} `);
    return deleteStaff;
  }

  async updateStatus(id: number, isActive: boolean, transaction: Transaction) {
    await this.userRepo.update(
      {
        isActive,
        updatedBy: id,
      },
      {
        where: { id },
        transaction,
      },
    );
    this.winstonLogger.warn(` User with ID ${id} Activated Successfully `);
    return true;
  }
}
