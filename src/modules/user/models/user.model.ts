import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Scopes,
  HasMany,
} from 'sequelize-typescript';
import { ROLES } from 'src/common/types/Roles.types';
import { Ticket } from 'src/modules/ticket/models/ticket.model';

@Scopes(() => ({
  basic: {
    attributes: {
      exclude: [
        'password',
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
  tableName: 'users',
  deletedAt: true,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  fname: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  lname: string;
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isActive: boolean;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  birthday: Date;

  @Column({
    type: DataType.ENUM(...Object.values(ROLES)),
  })
  role: ROLES;

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

  @HasMany(() => Ticket, 'user_id')
  tickets: Ticket[];
}
