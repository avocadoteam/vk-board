import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from 'src/db/tables/list';
import { ListMembership } from 'src/db/tables/listMembership';
import { Notification } from 'src/db/tables/notification';
import { Task } from 'src/db/tables/task';
import { ListModule } from 'src/list/list.module';
import { ListService } from 'src/list/list.service';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { RestricitionsModule } from 'src/restricitions/restricitions.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { TasksService } from 'src/tasks/tasks.service';
import { VkApiService } from 'src/vk-api/vk-api.service';
import { MTasksService } from './m-tasks.service';
import { MarusyaController } from './marusya.controller';
import { CreateScenario } from './scenarios/create.scenario';
import { FinishScenario } from './scenarios/finish.scenario';
import { NoTaskScenario } from './scenarios/no-task.scenario';
import { ShowScenario } from './scenarios/show.scenario';
import { UserChoiceScenario } from './scenarios/user-choice.scenario';
import { WelcomeScenario } from './scenarios/welcome.scenario';

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
    WelcomeScenario,
    FinishScenario,
    CreateScenario,
    ShowScenario,
    UserChoiceScenario,
    NoTaskScenario
  ],
  controllers: [MarusyaController],
})
export class MarusyaModule {}
