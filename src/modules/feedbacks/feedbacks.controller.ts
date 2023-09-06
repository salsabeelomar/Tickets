import {
  Controller,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { UserToken } from '../auth/dto/generate-Token.dto';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { Transaction } from 'sequelize';
import { ROLES } from 'src/common/types/Roles.types';
import { Role } from 'src/common/decorator/role.decorator';

@Controller('feedback')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Role(ROLES.USER)
  @Post()
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.feedbacksService.create(createFeedbackDto, user.id, trans);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.feedbacksService.update(id, user.id, updateFeedbackDto, trans);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.feedbacksService.remove(id, user.id, trans);
  }
}
