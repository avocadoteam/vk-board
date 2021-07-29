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
  user_id: number;

  @Column({
    type: 'timestamp',
  })
  created: Date;

  @Column({
    type: 'text',
  })
  amount: string;
  @Column({
    type: 'text',
  })
  voices: string;

  @Column({
    type: 'timestamp',
    name: 'last_g_sync',
    nullable: true,
  })
  last_g_sync: Date | null;

  constructor(
    amount: string,
    voices: string,
    userId: number,
    last_g_sync: string | null = null,
  ) {
    this.created = new Date();
    this.amount = amount;
    this.voices = voices;
    this.user_id = userId;
    this.last_g_sync = last_g_sync ? new Date(last_g_sync) : null;
  }
}
