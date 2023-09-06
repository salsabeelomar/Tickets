import { Injectable, Inject } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { Category } from './models/category.model';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { Transaction } from 'sequelize';
import { CheckExisting } from 'src/common/utils/checkExisting';

@Injectable()
export class CategoryService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.CATEGORY) private readonly categoryRepo: typeof Category,
  ) {}

  async create(
    createCategory: CreateCategoryDto,
    userId: number,
    transaction: Transaction,
  ) {
    const getCategory = await this.findByCategoryName(
      createCategory.category,
      transaction,
    );

    CheckExisting(!getCategory, {
      msg: 'Category Already Exist',
      trace: 'CategoryService.create',
    });

    const newCategory = await this.categoryRepo.create(
      {
        ...createCategory,
        createdBy: userId,
      },
      { transaction },
    );
    this.logger.log(`Create new Category ${createCategory.category}  `);

    return {
      data: {
        category: newCategory,
      },
      msg: 'New Category Add Successfully',
    };
  }

  async findAll(transaction: Transaction) {
    const categories = await this.categoryRepo
      .scope('basic')
      .findAll({ transaction });

    this.logger.log(`Get All Categories `);

    return {
      data: {
        categories,
      },
    };
  }

  async findById(id: number, transaction: Transaction) {
    const category = await this.categoryRepo.scope('basic').findByPk(id, {
      transaction,
    });
    CheckExisting(category, {
      msg: 'Category Not Found',
      trace: 'CategoryService.findById',
    });
    this.logger.log(`Get All Categories `);

    return {
      data: { category },
    };
  }

  async findByCategoryName(category: string, transaction: Transaction) {
    const getTag = await this.categoryRepo.scope('basic').findOne({
      where: { category },
      transaction,
    });

    return getTag;
  }
  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
