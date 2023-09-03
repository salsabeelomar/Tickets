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

@Scopes(() => ({
  basic: {
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
  tableName: 'support_staffs',
  paranoid: true,
  deletedAt: true,
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
    unique: true,
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
