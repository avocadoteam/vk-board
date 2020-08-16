import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/db/tables/task';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { List } from 'src/db/tables/list';

@Module({
  imports: [TypeOrmModule.forFeature([Task, List]), RedisCacheModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
