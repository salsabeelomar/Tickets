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
import { Rating } from 'src/common/types/Rating.types';
import { Ticket } from 'src/modules/ticket/entities/ticket.entity';
import { User } from 'src/modules/user/entities/user.entity';
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
      isIn: [Object.values(Rating)],
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
