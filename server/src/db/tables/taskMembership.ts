import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Task } from './task';
import { ColumnNumericTransformer } from '../transform/int8';

@Entity({
  name: 'task_membership'
})
export class TaskMembership {
  @PrimaryGeneratedColumn('increment', { type: 'int8' })
  id!: number;

  @Column({
    type: 'timestamp',
  })
  joined: Date;

  @Column({
    type: 'int8',
    name: 'joined_id',
    transformer: new ColumnNumericTransformer()
  })
  joinedId: number;

  @ManyToOne((type) => Task, (task) => task.memberships)
  @JoinColumn({
    name: 'task_id',
  })
  @Index()
  task: Task;

  constructor(joinedBy: number, task: Task) {
    this.joinedId = joinedBy;
    this.task = task;
    this.joined = new Date();
  }
}
