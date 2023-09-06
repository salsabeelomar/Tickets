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
    const getTag = await this.findByTagName(createTagDto.tag, transaction);
    CheckExisting(!getTag, {
      msg: 'Tag Already Exist',
      trace: 'TagService.create',
    });
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

    return {
      data: {
        tag: newTag,
      },
      msg: 'New Tag added successfully',
    };
  }

  async findAll(transaction: Transaction) {
    const tags = await this.tagRepo.scope('basic').findAll({
      transaction,
    });
    this.logger.log(`Get All Tags`);
    return {
      data: {
        tags,
      },
    };
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

    return {
      data: { tag },
    };
  }

  async findByTagName(tag: string, transaction: Transaction) {
    const getTag = await this.tagRepo.scope('basic').findOne({
      where: { tag },
      transaction,
    });

    return getTag;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} tag`;
  // }
}
