import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Providers } from 'src/common/constant/providers.constant';
import { User } from './entities/user.entity';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { GenerateToken } from '../auth/dto/generate-Token.dto';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from 'sequelize';

@Injectable()
export class UserService {
  private readonly winstonLogger = new WinstonLogger();
  constructor(
    @Inject(Providers.USER) private readonly userRepo: typeof User,
    private readonly jwt: JwtService,
  ) {}

  async getUserByEmail(email: string) {
    const getUser = await this.userRepo.findOne({
      where: {
        email,
      },
    });
    this.winstonLogger.log(`Get User with Email ${email}`);
    return getUser;
  }

  generateToken(user: GenerateToken) {
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
    CheckExisting(user.email, NotFoundException, {
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
}
