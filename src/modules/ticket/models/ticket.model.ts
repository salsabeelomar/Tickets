import {
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  Table,
  BelongsTo,
  Scopes,
  Model,
} from 'sequelize-typescript';
import { PRIORITIZE } from 'src/common/types/Prioritize.types';
import { Category } from 'src/modules/category/models/category.model';
import { Tags } from 'src/modules/tags/models/tag.model';
import { TicketStatus } from 'src/modules/ticket-status/models/ticket-status.model';
import { User } from 'src/modules/user/models/user.model';

@Scopes(() => ({
  times: {
    attributes: {
      exclude: [
        'createdAt',
        'updatedAt',
        'updatedBy',
        'deletedAt',
        'deletedBy',
      ],
    },
  },
}))
@Table({
  tableName: 'tickets',
})
export class Ticket extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  adminId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  staffId: number;

  @ForeignKey(() => TicketStatus)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  statusId: number;

  @Column({
    type: DataType.ENUM(...Object.values(PRIORITIZE)),
    defaultValue: PRIORITIZE.LOW,
  })
  prioritize: PRIORITIZE;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isConfirm: boolean;

  @ForeignKey(() => Tags)
  @Column({
    type: DataType.INTEGER,
  })
  tagId: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  title: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  description: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  createdBy: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  updatedBy: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  deletedBy: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => User, 'adminId')
  admin: User;

  @BelongsTo(() => Tags)
  tag: Tags;

  @BelongsTo(() => User, 'staffId')
  staff: User;

  @BelongsTo(() => Category, 'categoryId')
  category: Category;

  @BelongsTo(() => TicketStatus)
  ticketStatus: TicketStatus;
}
