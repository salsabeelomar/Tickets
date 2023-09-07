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
  HasMany,
} from 'sequelize-typescript';
import { PRIORITIZE } from 'src/common/types/Prioritize.types';
import { Category } from 'src/modules/category/models/category.model';
import { SupportStaff } from 'src/modules/support-staff/models/support-staff.model';
import { Tags } from 'src/modules/tags/models/tag.model';
import { TicketStatus } from 'src/modules/ticket-status/models/ticket-status.model';
import { Tracking } from 'src/modules/tracking/models/tracking.model';
import { User } from 'src/modules/user/models/user.model';

@Scopes(() => ({
  basic: {
    attributes: {
      exclude: ['updatedAt', 'updatedBy', 'deletedAt', 'deletedBy'],
    },
  },
  withStatus:{
    include: [
      {
        model: TicketStatus,
        attributes: ['status'],
      },
    ],
  }
}))
@Table({
  tableName: 'tickets',
  paranoid: true,
  deletedAt: true,
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

  @ForeignKey(() => SupportStaff)
  @Column({
    type: DataType.INTEGER,
  })
  assignmentId: number;

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

  @BelongsTo(() => SupportStaff)
  assigned: SupportStaff;

  @BelongsTo(() => Category, 'categoryId')
  category: Category;

  @BelongsTo(() => TicketStatus)
  ticketStatus: TicketStatus;

  @HasMany(() => Tracking)
  trackings: Tracking[];
}
