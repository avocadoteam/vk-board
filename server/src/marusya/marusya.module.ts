import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/db/tables/task';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { List } from 'src/db/tables/list';
import { Notification } from 'src/db/tables/notification';
import { MarusyaController } from './marusya.controller';
import { TasksService } from 'src/tasks/tasks.service';
import { MTasksService } from './m-tasks.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { ListModule } from 'src/list/list.module';
import { ListService } from 'src/list/list.service';
import { ListMembership } from 'src/db/tables/listMembership';
import { ConfigModule } from '@nestjs/config';
import { RestricitionsModule } from 'src/restricitions/restricitions.module';
import { VkApiService } from 'src/vk-api/vk-api.service';
import { ScenarioService } from './scenario.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, List, Notification, ListMembership]),
    TasksModule,
    ListModule,
    RedisCacheModule,
    HttpModule,
    ConfigModule,
    RestricitionsModule,
  ],
  providers: [
    TasksService,
    MTasksService,
    ListService,
    VkApiService,
    ScenarioService,
  ],
  controllers: [MarusyaController],
})
export class MarusyaModule {}
