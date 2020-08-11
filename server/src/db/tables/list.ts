import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from './task';

@Entity()
export class List {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    length: 512,
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

  @OneToMany((type) => Task, (task) => task.list)
  tasks!: Task[];
}
