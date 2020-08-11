import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { List } from './list';
import { TaskMembership } from './taskMembership';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('increment', { type: 'int8' })
  id!: number;

  @Column({
    type: 'uuid',
  })
  taskGUID!: string;

  @Column({
    length: 1024,
  })
  name!: string;

  @Column({
    type: 'timestamp',
  })
  created!: string;

  @Column({
    type: 'int8',
    name: 'created_by',
  })
  createdBy!: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  finished!: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deleted!: string;

  @Column({
    type: 'interval',
    nullable: true,
    name: 'due_date',
  })
  dueDate!: string;

  @OneToMany((type) => TaskMembership, (tm) => tm.task)
  memberships!: TaskMembership[];

  @ManyToOne((type) => List, (list) => list.tasks)
  @JoinColumn({
    name: 'list_id',
  })
  @Index()
  list!: List;
}
