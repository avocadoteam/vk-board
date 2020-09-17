import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { ColumnNumericTransformer } from '../transform/int8';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('increment', { type: 'int8' })
  id!: string;

  @Column({
    type: 'int8',
    name: 'user_id',
    transformer: new ColumnNumericTransformer(),
  })
  userId!: number;

  @Column({
    type: 'bool',
    name: 'vk_notification',
  })
  vkNotification!: boolean;

  @Column({
    type: 'simple-array'
  })
  tasks!: string[] | null;
}
