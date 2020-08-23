import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/db/tables/task';
import { Repository } from 'typeorm';
import { VkApiService } from 'src/vk-api/vk-api.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Task)
    private tableTask: Repository<Task>,
    private vkApiService: VkApiService,
  ) {}

  @Cron('0 30 11 * * *')
  // @Cron('55 * * * * *')
  async handleCron() {
    this.logger.debug('Called when the current second is 55');
    const userIds = await this.fetchUserIdsFromTasksDayBeforeTheEnd();

    if (userIds.length) {
      this.logger.log(`notify these userIds ${userIds.join(',')}`);
      this.vkApiService.notifyPersonsForIncomingTasks(userIds);
    }
  }

  async fetchUserIdsFromTasksDayBeforeTheEnd() {
    const tasks = await this.tableTask
      .createQueryBuilder('task')
      .where(
        `deleted is null and due_date is not null and date_trunc('day', now() + INTERVAL '1 day') = date_trunc('day', due_date)`,
      )
      .select(['task.createdBy'])
      .distinctOn(['task.createdBy'])
      .getMany();

    return tasks.map((t) => t.createdBy);
  }
}
