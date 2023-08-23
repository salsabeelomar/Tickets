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
import { Status } from 'src/common/types/status.types';
import { TicketStatus } from 'src/modules/ticket-status/entities/ticket-status.entity';
import { Ticket } from 'src/modules/ticket/entities/ticket.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Table({
  tableName: 'tracking',
})
export class Tracking extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => TicketStatus)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  statusId: number;

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

  @ForeignKey(() => Ticket)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ticketId: number;

  @Column({
    type: DataType.DATEONLY,
  })
  scheduleFor: Date;

  @Column({
    type: DataType.STRING,
  })
  comments: string;

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
  
  @BelongsTo(() => User)
  staff: User;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @BelongsTo(() => TicketStatus)
  status: TicketStatus;
}
