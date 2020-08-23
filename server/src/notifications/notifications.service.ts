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
    this.logger.debug('Called cron job for notifications');
    const userIds = await this.fetchUserIdsFromTasksDayBeforeTheEnd();

    if (userIds.length) {
      this.logger.log(`notify these userIds ${userIds.join(',')}`);
      this.vkApiService.notifyPersonsForIncomingTasks(userIds);
    }
  }

  async fetchUserIdsFromTasksDayBeforeTheEnd(): Promise<number[]> {
    const userIdsToNotify = await this.tableTask.query(`
      select distinct lm.joined_id
        from task t 
        inner join list l on l.id = t.list_id and l.deleted is null
        inner join list_membership lm on lm.list_id = l.id and lm.left_date is null
        where t.deleted is null and t.due_date is not null and date_trunc('day', now() + INTERVAL '1 day') = date_trunc('day', t.due_date)
    `);

    return (userIdsToNotify as { joined_id: string }[]).map((u) =>
      Number(u.joined_id),
    );
  }
}
