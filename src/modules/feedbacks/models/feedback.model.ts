import {
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  Table,
  BelongsTo,
  Model,
} from 'sequelize-typescript';
import { RATING } from 'src/common/types/Rating.types';
import { Ticket } from 'src/modules/ticket/models/ticket.model';
import { User } from 'src/modules/user/models/user.model';
@Table({
  tableName: 'feedbacks',
})
export class Feedback extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => Ticket)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ticketId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  feedback: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      isIn: [Object.values(RATING)],
    },
  })
  rating: number;

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

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Ticket)
  ticket: Ticket;
}
