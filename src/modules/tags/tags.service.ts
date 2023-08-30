import { Injectable, Inject } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { Tags } from './models/tag.model';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { Transaction } from 'sequelize';

@Injectable()
export class TagsService {
  private readonly logger = new WinstonLogger();

  constructor(@Inject(PROVIDER.TAGS) private readonly tagRepo: typeof Tags) {}

  async create(
    createTagDto: CreateTagDto,
    userId: number,
    transaction: Transaction,
  ) {
    const newTag = await this.tagRepo.create(
      {
        ...createTagDto,
        createdBy: userId,
      },
      {
        transaction,
      },
    );
    this.logger.log('tags created successfully');

    return newTag;
  }

  async findAll(transaction: Transaction) {
    const tags = await this.tagRepo.scope('basic').findAll({
      transaction,
    });
    this.logger.log(`Get All Tags`);
    return tags;
  }

  async findById(id: number, transaction: Transaction) {
    const tag = await this.tagRepo.scope('basic').findByPk(id, {
      transaction,
    });

    CheckExisting(tag, {
      msg: 'Tag Not Found',
      trace: 'TagService.findById',
    });
    this.logger.log(`Get Tag By Id ${id} `);

    return tag;
  }

  // update(id: number, updateTagDto: UpdateTagDto) {
  //   return `This action updates a #${id} tag`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tag`;
  // }
}
