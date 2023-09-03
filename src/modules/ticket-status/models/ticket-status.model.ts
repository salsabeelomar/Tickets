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
import { User } from 'src/modules/user/models/user.model';

@Table({
  tableName: 'ticket_status',
  paranoid: true,
  deletedAt: true,
})
export class TicketStatus extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  status: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  Code: string;

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
  users: User;
}
