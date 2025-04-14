import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Block } from './Block.js';

@Table({
  tableName: 'files',
  timestamps: false,
})
export class File extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column(DataType.STRING)
  filename!: string;

  @Column(DataType.STRING)
  original_filename!: string;

  @Column(DataType.INTEGER)
  file_size!: number;

  @Column(DataType.ENUM('DWG', 'DXF'))
  file_type!: 'DWG' | 'DXF';

  @Column(DataType.DATE)
  upload_date!: Date;

  @Column(DataType.STRING)
  file_path!: string;

  @HasMany(() => Block)
  blocks!: Block[];
}
