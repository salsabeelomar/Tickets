import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Transaction } from 'sequelize';
import { TransactionInter } from 'src/common/interceptor/Transaction.interceptor';
import { UserToken } from '../auth/dto/generate-Token.dto';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { Role } from 'src/common/decorator/role.decorator';
import { ROLES } from 'src/common/types/Roles.types';

@UseInterceptors(TransactionInter)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Role(ROLES.USER)
  @Post()
  create(
    @Body() createTagDto: CreateTagDto,
    @User() user: UserToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.tagsService.create(createTagDto, user.id, trans);
  }

  
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @TransactionDeco() trans: Transaction,
    ) {
      return this.tagsService.findById(id, trans);
    }
    
    @Get()
    findAll(@TransactionDeco() trans: Transaction) {
      return this.tagsService.findAll(trans);
    }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
  //   return this.tagsService.update(+id, updateTagDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tagsService.remove(+id);
  // }
}
