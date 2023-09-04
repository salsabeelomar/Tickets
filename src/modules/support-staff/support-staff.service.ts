import { Injectable, Inject } from '@nestjs/common';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { UserService } from '../user/user.service';
import { VerifyEmailService } from '../verify-email/verify-email.service';
import { Transaction } from 'sequelize';
import { SupportStaff } from './models/support-staff.model';
import { STAFF_STATUS } from 'src/common/types/staff-status.types';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { UserToken } from '../auth/dto/generate-Token.dto';
import { CheckExisting } from 'src/common/utils/checkExisting';

@Injectable()
export class StaffService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.STAFF) private readonly supportRepo: typeof SupportStaff,
    private readonly userService: UserService,
    private readonly verifyEmail: VerifyEmailService,
  ) {}
  async createStaff(userId: number, adminId: number, transaction: Transaction) {
    const staff = await this.supportRepo.create(
      {
        userId: userId,
        adminId: adminId,
        status: STAFF_STATUS.PENDING,
        createdBy: adminId,
      },
      { transaction },
    );
    this.logger.log(`new Staff is Created with ID ${staff.id} `);
    return staff;
  }

  async signUpStaff(
    newStaff: CreateAuthDto,
    user: UserToken,
    transaction: Transaction,
  ) {
    const newUser = await this.userService.addUser(
      { ...newStaff, createdBy: user.id },
      transaction,
    );
    const staff = await this.createStaff(newUser.user.id, user.id, transaction);
    await this.verifyEmail.invitationStaff({
      email: newUser.user.email,
      activeToken: this.userService.generateToken({
        ...newUser.user,
        isActive: true,
      }),
      declineToken: this.userService.generateToken({
        ...newUser.user,
        isActive: false,
      }),
    });

    this.logger.log('Waiting Staff To Accept Invitation');

    return { staff, msg: 'Waiting Staff To Accept Invitation' };
  }
  async verifyStaffInvitation(token: string, transaction: Transaction) {
    const decoded = this.userService.verifyToken(token);
    const getAsStaff = await this.findStaffByUserId(decoded.sub, transaction);
    if (decoded.user.isActive) {
      return this.acceptStaff(getAsStaff.id, decoded.sub, transaction);
    } else {
      return this.removeStaff(getAsStaff.id, decoded.sub, transaction);
    }
  }
  async findStaffByUserId(id: number, transaction: Transaction) {
    const getStaff = await this.supportRepo
      .scope('basic')
      .findOne({ where: { userId: id }, transaction });

    CheckExisting(getStaff, {
      msg: 'Staff with this Id not Found',
      trace: 'StaffService.findStaffByUserId',
    });
    return getStaff;
  }
  async findStaffById(id: number) {
    const getStaff = await this.supportRepo.scope('basic').findByPk(id);

    CheckExisting(getStaff, {
      msg: 'Staff with this Id not Found',
      trace: 'StaffService.findStaffById',
    });

    return getStaff;
  }

  async update(updateStaff: UpdateStaffDto, transaction: Transaction) {
    await this.supportRepo.update(
      { updatedBy: updateStaff.id, ...updateStaff },
      { where: { id: updateStaff.id }, transaction },
    );
    this.logger.log(
      `Staff with Id ${updateStaff.id} Updated Successfully to ${updateStaff.status}`,
    );
    return `Staff with Id ${updateStaff.id} Updated Successfully`;
  }

  async removeStaff(id: number, userId: number, transaction: Transaction) {
    await this.supportRepo.update(
      {
        status: STAFF_STATUS.DECLINE,
        deletedBy: id,
        deletedAt: new Date(),
      },
      { where: { id: id }, transaction },
    );
    await this.userService.removeUser(id, userId, transaction);
    this.logger.log(`Staff with Id ${id} Deleted Successfully`);
    return `Staff with Id ${id} Deleted Successfully`;
  }

  async acceptStaff(id: number, userId: number, transaction: Transaction) {
    await this.supportRepo.update(
      { status: STAFF_STATUS.ACCEPT, updatedBy: id, updatedAt: new Date() },
      { where: { id: id }, transaction },
    );

    await this.userService.updateStatus(userId, true, transaction);
    this.logger.log(`Staff with Id ${id} Activated Successfully`);

    return `Staff with Id ${id} Activated Successfully`;
  }
}
