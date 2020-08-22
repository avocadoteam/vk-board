import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../transform/int8';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'int8',
    transformer: new ColumnNumericTransformer(),
  })
  user_id!: number;

  @Column({
    type: 'timestamp',
  })
  created: Date;

  constructor() {
    this.created = new Date();
  }
}
