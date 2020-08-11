import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from 'src/db/tables/list';

@Module({
  imports: [TypeOrmModule.forFeature([List])],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {}
