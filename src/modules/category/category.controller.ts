import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from 'src/common/decorator/user.decorator';
import { GenerateToken } from '../auth/dto/generate-Token.dto';
import { TransactionDeco } from 'src/common/decorator/transaction.decorator';
import { Transaction } from 'sequelize';
import { TransactionInter } from 'src/common/interceptor/Transaction.interceptor';
import { ROLES } from 'src/common/types/Roles.types';
import { Role } from 'src/common/decorator/role.decorator';

@UseInterceptors(TransactionInter)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Role(ROLES.USER)
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.categoryService.create(createCategoryDto, user.id, trans);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: GenerateToken,
    @TransactionDeco() trans: Transaction,
  ) {
    return this.categoryService.findById(id, trans);
  }

  @Get()
  findAll(@TransactionDeco() trans: Transaction) {
    return this.categoryService.findAll(trans);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoryService.remove(+id);
  // }
}
