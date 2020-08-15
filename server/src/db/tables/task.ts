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
import { v4 } from 'uuid';
import { ColumnNumericTransformer } from '../transform/int8';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('increment', { type: 'int8' })
  id!: number;

  @Column({
    type: 'uuid',
    name: 'taskguid',
  })
  taskGUID: string;

  @Column({
    length: 1024,
  })
  name: string;

  @Column({
    length: 2048,
  })
  description: string;

  @Column({
    type: 'timestamp',
  })
  created: Date;

  @Column({
    type: 'int8',
    name: 'created_by',
    transformer: new ColumnNumericTransformer(),
  })
  createdBy: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  finished!: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deleted!: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'due_date',
  })
  dueDate: Date | null;

  @OneToMany((type) => TaskMembership, (tm) => tm.task)
  memberships!: TaskMembership[];

  @ManyToOne((type) => List, (list) => list.tasks)
  @JoinColumn({
    name: 'list_id',
  })
  @Index()
  list: List;

  constructor(
    name: string,
    description: string,
    createdBy: number,
    list: List,
    dueDate: string | null = null,
  ) {
    this.name = name;
    this.createdBy = createdBy;
    this.created = new Date();
    this.dueDate = dueDate ? new Date(dueDate) : null;
    this.list = list;
    this.taskGUID = v4();
    this.description = description;
  }
}
