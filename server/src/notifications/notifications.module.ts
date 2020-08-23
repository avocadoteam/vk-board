import { Module, HttpModule } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Task } from 'src/db/tables/task';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VkApiService } from 'src/vk-api/vk-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), HttpModule, ConfigModule],
  providers: [NotificationsService, VkApiService],
})
export class NotificationsModule {}
