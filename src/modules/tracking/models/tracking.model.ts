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
import { SupportStaff } from 'src/modules/support-staff/models/support-staff.model';
import { TicketStatus } from 'src/modules/ticket-status/models/ticket-status.model';
import { Ticket } from 'src/modules/ticket/models/ticket.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  tableName: 'tracking',
  paranoid: true,
  deletedAt: true,
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

  @ForeignKey(() => SupportStaff)
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
    type: DataType.STRING,
  })
  comments: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  sendEmail: boolean;

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

  @BelongsTo(() => SupportStaff, 'staffId')
  staff: SupportStaff;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @BelongsTo(() => TicketStatus)
  status: TicketStatus;
}
