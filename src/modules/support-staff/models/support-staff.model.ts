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
import { STAFF_STATUS } from 'src/common/types/staff-status.types';
import { User } from 'src/modules/user/models/user.model';

@Table({
  tableName: 'support_staffs',
})
export class SupportStaff extends Model {
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
  adminId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.ENUM(...Object.values(STAFF_STATUS)),
    defaultValue: STAFF_STATUS.PENDING,
  })
  status: STAFF_STATUS = STAFF_STATUS.PENDING;

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
}
