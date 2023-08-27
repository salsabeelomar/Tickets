import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Providers } from 'src/common/constant/providers.constant';
import { Feedback } from './entities/feedback.entity';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { Transaction } from 'sequelize';
import { TicketService } from '../ticket/ticket.service';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { Status } from 'src/common/types/status.types';

@Injectable()
export class FeedbacksService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(Providers.FEEDBACK)
    private readonly feedbackRepo: typeof Feedback,
    private readonly ticketService: TicketService,
  ) {}
  async create(
    newFeed: CreateFeedbackDto,
    userId: number,
    transaction: Transaction,
  ) {
    const ticket = await this.ticketService.getTicById(newFeed.ticketId);
    CheckExisting(
      !(ticket.ticketStatus.status !== Status.Resolved),
      BadRequestException,
      {
        msg: 'This Ticket Not Resolved Yet',
        trace: 'Feedback.create',
      },
    );
    const feedback = await this.feedbackRepo.create(
      {
        ...newFeed,
        createdBy: userId,
      },
      { transaction },
    );
    this.logger.log(`create Feedback For Ticket ${newFeed.ticketId}`);
    return { feedback: feedback.toJSON() };
  }

  findAll() {
    return `This action returns all feedbacks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
