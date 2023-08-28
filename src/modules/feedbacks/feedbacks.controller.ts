import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { GenerateToken } from '../auth/dto/generate-Token.dto';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { Transaction } from 'sequelize';
import { Roles } from 'src/common/types/Roles.types';
import { Role } from 'src/common/decorator/role.decorator';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Role(Roles.User)
  @Post()
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.feedbacksService.create(createFeedbackDto, user.id, trans);
  }

  // @Get()
  // findAll() {
  //   return this.feedbacksService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.feedbacksService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbacksService.update(+id, updateFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(+id);
  }
}
