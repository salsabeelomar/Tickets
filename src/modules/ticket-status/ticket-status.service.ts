import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CreateTicketStatusDto } from './dto/create-ticket-status.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { TicketStatus } from './models/ticket-status.model';
import { STATUS } from 'src/common/types/status.types';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { Transaction } from 'sequelize';
import { CheckExisting } from 'src/common/utils/checkExisting';
@Injectable()
export class TicketStatusService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.STATUS) private readonly statusRepo: typeof TicketStatus,
  ) {}
  create(createTicketStatusDto: CreateTicketStatusDto) {
    return 'This action adds a new ticketStatus';
  }

  async findOne(status: STATUS, transaction: Transaction): Promise<number> {
    const getStatus = await this.statusRepo.findOne({
      attributes: ['id'],
      where: {
        status,
      },
      transaction,
    });
    CheckExisting(getStatus, {
      msg: 'Status Not Found',
      trace: 'TicketStatusService',
    });
    this.logger.log(`Get Status ID for ${status}`);
    return getStatus.id;
  }

  update(id: number, updateTicketStatusDto: UpdateTicketStatusDto) {
    return `This action updates a #${id} ticketStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketStatus`;
  }
}
