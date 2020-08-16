import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ColumnNumericTransformer } from '../transform/int8';
import { List } from './list';

@Entity({
  name: 'list_membership',
})
export class ListMembership {
  @PrimaryGeneratedColumn('increment', { type: 'int8' })
  id!: number;

  @Column({
    type: 'timestamp',
  })
  joined: Date;

  @Column({
    type: 'int8',
    name: 'joined_id',
    transformer: new ColumnNumericTransformer(),
  })
  joinedId: number;

  @ManyToOne((type) => List, (list) => list.memberships)
  @JoinColumn({
    name: 'list_id',
  })
  @Index()
  list: List;

  constructor(joinedBy: number, list: List) {
    this.joinedId = joinedBy;
    this.list = list;
    this.joined = new Date();
  }
}
