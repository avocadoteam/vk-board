import { Controller, Get, Logger, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Task } from 'src/db/tables/task';
import { Repository } from 'typeorm';

@Controller('api/time')
export class TimeController {
  private readonly logger = new Logger(TimeController.name);
  constructor(
    @InjectRepository(Task)
    private tableTask: Repository<Task>,
  ) {}

  @Get()
  getServeTime(@Query('time') time: string) {
    return {
      ask: time,
      set: moment(time, ['h:m']).format(),
    };
  }

  @Get('/task')
  async getSpecificTask() {
    const task = await this.tableTask.findOne('35');
    return { ...task, dueDate2: moment(task?.dueDate).format() };
  }
}
