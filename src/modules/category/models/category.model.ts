import {
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Table,
  Model,
  ForeignKey,
  BelongsTo,
  Scopes,
} from 'sequelize-typescript';
import { User } from 'src/modules/user/models/user.model';

@Scopes(() => ({
  full: {},
  basic: {
    attributes: ['id', 'category'],
  },
}))
@Table({
  tableName: 'categories',
})
export class Category extends Model {
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
  category: string;

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
