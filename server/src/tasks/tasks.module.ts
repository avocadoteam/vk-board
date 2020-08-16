import { Module, HttpModule } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/db/tables/task';
import { VkApiService } from 'src/vk-api/vk-api.service';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { List } from 'src/db/tables/list';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, List]),
    HttpModule,
    ConfigModule,
    RedisCacheModule,
  ],
  providers: [TasksService, VkApiService],
  exports: [TasksService],
})
export class TasksModule {}
