import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Task } from 'src/db/tables/task';
import { AdminGuard } from 'src/guards/admin.guard';
import { SignGuard } from 'src/guards/sign.guard';
import { Repository } from 'typeorm';

@Controller('api/time')
@UseGuards(SignGuard, AdminGuard)
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
  async getSpecificTask(@Query('id') id?: string) {
    const task = await this.tableTask.findOne(id ?? '35');
    return { ...task, dueDate2: moment(task?.dueDate).format() };
  }
}
