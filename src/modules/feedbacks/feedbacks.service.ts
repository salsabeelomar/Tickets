import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { Feedback } from './models/feedback.model';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { Transaction } from 'sequelize';
import { TicketService } from '../ticket/ticket.service';

@Injectable()
export class FeedbacksService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.FEEDBACK)
    private readonly feedbackRepo: typeof Feedback,
    private readonly ticketService: TicketService,
  ) {}
  async create(
    newFeed: CreateFeedbackDto,
    userId: number,
    transaction: Transaction,
  ) {
    const ticket = await this.ticketService.getTicById(
      newFeed.ticketId,
      transaction,
    );

    if (
      ticket.ticketStatus.status === 'Resolved' ||
      ticket.ticketStatus.status === 'Closed'
    ) {
      const feedback = await this.feedbackRepo.create(
        {
          ...newFeed,
          createdBy: userId,
        },
        { transaction },
      );
      this.logger.log(`create Feedback For Ticket ${newFeed.ticketId}`);
      return { data: { feedback: feedback.toJSON() } };
    } else
      throw new BadRequestException(
        `Tickets Not Resolved Or Closed To add Feedbacks`,
      );
  }

  async update(
    id: number,
    userId: number,
    updateFeedbackDto: UpdateFeedbackDto,
    transaction: Transaction,
  ) {
    await this.feedbackRepo.update(
      {
        updateFeedbackDto,
        updatedBy: userId,
      },
      { where: { id, userId }, transaction },
    );
    this.logger.log(`Feedback Updated Successfully`);
    return { msg: `Feedback Updated Successfully` };
  }

  async remove(id: number, userId: number, transaction: Transaction) {
    await this.feedbackRepo.update(
      {
        deletedAt: new Date(),
        deletedBy: userId,
      },
      { where: { id, userId }, transaction },
    );
    this.logger.warn(`Feedback Deleted Successfully`);
    return { msg: `Feedback Deleted Successfully` };
  }
}
