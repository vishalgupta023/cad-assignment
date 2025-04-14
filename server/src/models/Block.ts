import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { File } from './File.js';

@Table({
  tableName: 'blocks',
  timestamps: false,
})
export class Block extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => File)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  file_id!: number;

  @BelongsTo(() => File)
  file!: File;

  @Column(DataType.STRING)
  block_name!: string;

  @Column(DataType.STRING)
  block_type?: string;

  @Column(DataType.JSONB)
  coordinates!: Record<string, any>;

  @Column(DataType.JSONB)
  properties?: Record<string, any>;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;
}
