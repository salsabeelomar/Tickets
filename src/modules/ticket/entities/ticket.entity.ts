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
import { Prioritize } from 'src/common/types/Prioritizae.types';
import { Category } from 'src/common/types/category.types';
import { TicketStatus } from 'src/modules/ticket-status/entities/ticket-status.entity';
import { User } from 'src/modules/user/entities/user.entity';

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
    type: DataType.ENUM(...Object.keys(Prioritize)),
    defaultValue: Prioritize.Low,
  })
  prioritize: Prioritize;

  @Column({
    type: DataType.ENUM(...Object.keys(Category)),
    allowNull: false,
  })
  category: Category;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isConfirm: boolean;

  @Column({
    type: DataType.STRING,
  })
  tag: string;

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

  @BelongsTo(() => User, 'staffId')
  staff: User;

  @BelongsTo(() => TicketStatus)
  ticketStatus: TicketStatus;
}
