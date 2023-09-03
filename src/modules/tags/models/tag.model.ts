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
import { User } from 'src/modules/user/models/user.model';

@Scopes(() => ({
  full: {},
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
  tableName: 'tags',
  paranoid: true,
  deletedAt: true,
})
export class Tags extends Model {
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
  tag: string;

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
}
