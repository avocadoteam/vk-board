import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Task } from './task';
import { ColumnNumericTransformer } from '../transform/int8';
import { ListMembership } from './listMembership';
import { v4 } from 'uuid';
import { GList } from './gList';

@Entity()
export class List {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'uuid',
    name: 'listguid',
  })
  listguid: string;

  @Column({
    length: 512,
  })
  name: string;

  @Column({
    type: 'timestamp',
  })
  created: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deleted!: Date | null;

  @Column({
    type: 'int8',
    name: 'created_by',
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  createdBy: number | null;

  @OneToMany((type) => Task, (task) => task.list)
  tasks!: Task[];

  @OneToOne((type) => GList, (task) => task.list)
  gList!: GList;

  @OneToMany((type) => ListMembership, (lm) => lm.list)
  memberships!: ListMembership[];

  constructor(name: string, createdBy: number) {
    this.name = name;
    this.createdBy = createdBy;
    this.created = new Date();
    this.listguid = v4();
  }
}
