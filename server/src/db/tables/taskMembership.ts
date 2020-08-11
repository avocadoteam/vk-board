import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Task } from './task';

@Entity()
export class TaskMembership {
  @PrimaryGeneratedColumn('increment', { type: 'int8' })
  id!: number;

  @Column({
    type: 'timestamp',
  })
  joined!: string;

  @Column({
    type: 'int8',
    name: 'joined_by',
  })
  joinedBy!: number;

  @ManyToOne((type) => Task, (task) => task.memberships)
  @JoinColumn({
    name: 'task_id',
  })
  @Index()
  task!: Task;
}
