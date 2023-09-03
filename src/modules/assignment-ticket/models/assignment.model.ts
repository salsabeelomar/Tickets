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
import { ASSIGNMENT } from 'src/common/types/Assignment.types';
import { Ticket } from 'src/modules/ticket/models/ticket.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  tableName: 'assignment_tickets',
  paranoid: true,
  deletedAt: true,
})
export class AssignmentTickets extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => Ticket)
  @Column({
    type: DataType.INTEGER,
  })
  ticketId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  staffId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  adminId: number;

  @Column({
    type: DataType.ENUM(...Object.values(ASSIGNMENT)),
    allowNull: false,
  })
  assigned: ASSIGNMENT;

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

  @BelongsTo(() => User, 'adminId')
  admin: User;

  @BelongsTo(() => User, 'staffId')
  staff: User;

  @BelongsTo(() => Ticket)
  ticket: Ticket;
}
