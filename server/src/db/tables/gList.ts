import { Entity, JoinColumn, Index, OneToOne, PrimaryColumn, OneToMany, Column } from 'typeorm';
import { List } from './list';
import { Task } from './task';

@Entity({
  name: 'g_list',
})
export class GList {
  @PrimaryColumn({
    type: 'text',
    name: 'g_list_id',
  })
  g_list_id: string;

  @OneToOne((type) => List, (list) => list.gList)
  @JoinColumn({
    name: 'list_id',
  })
  @Index()
  list!: List;

  @OneToMany((type) => Task, (task) => task.gList)
  tasks!: Task[];

  constructor(list: List, gListId: string) {
    this.list = list;
    this.g_list_id = gListId;
  }
}
