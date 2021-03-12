import { Controller, Get, Logger, Query } from '@nestjs/common';
import * as moment from 'moment';

@Controller('api/time')
export class TimeController {
  private readonly logger = new Logger(TimeController.name);
  @Get()
  getServeTime(@Query('time') time: string) {
    return {
      ask: time,
      set: moment(time, ['h:m']).format(),
    };
  }
}
