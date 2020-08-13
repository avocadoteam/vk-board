import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from 'src/db/tables/list';
import { ListController } from './list.controller';
import { TasksModule } from 'src/tasks/tasks.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([List]), TasksModule, RedisCacheModule],
  providers: [ListService],
  exports: [ListService],
  controllers: [ListController],
})
export class ListModule {}
