import { Injectable, Inject } from '@nestjs/common';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { TicketStatus } from './models/ticket-status.model';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { Transaction } from 'sequelize';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { CreateTicketStatusDto } from './dto/create-ticket-status.dto';
@Injectable()
export class TicketStatusService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.STATUS) private readonly statusRepo: typeof TicketStatus,
  ) {}
  async create(
    newStatus: CreateTicketStatusDto,
    userId: number,
    transaction: Transaction,
  ) {
    const createStatus = await this.statusRepo.create(
      {
        status: newStatus.status,
        code: newStatus.code.toLocaleUpperCase(),
        createdBy: userId,
      },
      { transaction },
    );
    this.logger.log(`New Status For Tickets is Created`);
    return createStatus;
  }

  async findOne(status: string, transaction: Transaction) {
    console.log('jjjjjjjjjjjjjjjjjjjjjjjjjj');
    const getStatus = await this.statusRepo.findOne({
      attributes: ['id'],
      where: {
        status,
      },
      transaction,
    });

    CheckExisting(getStatus.id, {
      msg: 'Status Not Found',
      trace: 'TicketStatusService',
    });
    this.logger.log(`Get Status ID for ${getStatus.id}`);
    return getStatus;
  }
  async findByStatusId(id: number, transaction: Transaction) {
    const getStatus = await this.statusRepo
      .scope('basic')
      .findByPk(id, { transaction });
    this.logger.log(`Get Status By Id #${id}`);
    return getStatus;
  }

  update(id: number, updateTicketStatusDto: UpdateTicketStatusDto) {
    return `This action updates a #${id} ticketStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketStatus`;
  }
}
