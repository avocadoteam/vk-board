import { Module, HttpModule } from '@nestjs/common';
import { ListService } from './list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from 'src/db/tables/list';
import { ListController } from './list.controller';
import { TasksModule } from 'src/tasks/tasks.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { VkApiService } from 'src/vk-api/vk-api.service';
import { ConfigModule } from '@nestjs/config';
import { ListMembership } from 'src/db/tables/listMembership';
import { RestricitionsModule } from 'src/restricitions/restricitions.module';
import { Notification } from 'src/db/tables/notification';

@Module({
  imports: [
    TypeOrmModule.forFeature([List, ListMembership, Notification]),
    TasksModule,
    RedisCacheModule,
    HttpModule,
    ConfigModule,
    RestricitionsModule,
  ],
  providers: [ListService, VkApiService],
  exports: [ListService],
  controllers: [ListController],
})
export class ListModule {}
