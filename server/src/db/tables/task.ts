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
import { v4 } from 'uuid';
import { ColumnNumericTransformer } from '../transform/int8';
import { GList } from './gList';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('increment', { type: 'int8' })
  id!: string;

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
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  description: string | null;

  @Column({
    type: 'timestamp',
  })
  created: Date | string;

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
  finished: Date | null;

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

  @Column({
    type: 'text',
    name: 'g_task_id',
    nullable: true,
  })
  g_task_id: string | null;

  @ManyToOne((type) => List, (list) => list.tasks)
  @JoinColumn({
    name: 'list_id',
  })
  @Index()
  list: List;

  @ManyToOne((type) => GList, (glist) => glist.tasks)
  @JoinColumn({
    name: 'g_list_id',
  })
  @Index()
  gList: GList | null;

  constructor(
    name: string,
    createdBy: number,
    list: List,
    description: string | null = null,
    dueDate: Date | null = null,
    g_task_id: string | null = null,
    gList: GList | null = null,
    finished: string | null = null,
  ) {
    this.name = name;
    this.createdBy = createdBy;
    this.created = new Date();
    this.dueDate = dueDate;
    this.list = list;
    this.taskGUID = v4();
    this.description = description;
    this.g_task_id = g_task_id;
    this.gList = gList;
    this.finished = finished ? new Date(finished) : null;
  }
}
