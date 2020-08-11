import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { ListModule } from 'src/list/list.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [RedisCacheModule, ListModule, TasksModule],
  controllers: [BoardController],
})
export class BoardModule {}
