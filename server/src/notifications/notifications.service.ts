import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // @Cron('0 30 11 * * *')
  @Cron('55 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 55');
  }
}
