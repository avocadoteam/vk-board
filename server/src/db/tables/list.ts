import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from './task';
import { ColumnNumericTransformer } from '../transform/int8';

@Entity()
export class List {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    length: 512,
  })
  name: string;

  @Column({
    type: 'timestamp',
  })
  created: Date;

  @Column({
    type: 'int8',
    name: 'created_by',
    nullable: true,
    transformer: new ColumnNumericTransformer()
  })
  createdBy: number | null;

  @OneToMany((type) => Task, (task) => task.list)
  tasks!: Task[];

  constructor(name: string, createdBy: number) {
    this.name = name;
    this.createdBy = createdBy;
    this.created = new Date();
  }
}
