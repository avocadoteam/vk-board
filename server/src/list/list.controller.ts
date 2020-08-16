import {
  Controller,
  UseGuards,
  Get,
  UseInterceptors,
  Query,
  ParseIntPipe,
  HttpStatus,
  NotFoundException,
  Put,
  Body,
  BadRequestException,
  Delete,
  CacheTTL,
} from '@nestjs/common';
import { SignGuard } from 'src/guards/sign.guard';
import { ListService } from './list.service';
import { TasksService } from 'src/tasks/tasks.service';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { FinishTasksModel } from 'src/contracts/task';
import { TasksCacheInterceptor } from 'src/interceptors/cache.interceptor';

@Controller('api/list')
@UseGuards(SignGuard)
@UseInterceptors(TransformInterceptor)
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly taskService: TasksService,
  ) {}

  @UseInterceptors(TasksCacheInterceptor)
  @CacheTTL(60)
  @Get('/tasks')
  async getListTasks(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Query(
      'listId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    listId: number,
  ) {
    if (!(await this.listService.isListExists(listId, vkUserId))) {
      throw new NotFoundException('List not found');
    }
    return this.taskService.getTasks(listId, vkUserId);
  }

  @Put('/tasks')
  async finishTasks(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: FinishTasksModel,
  ) {
    if (!(await this.taskService.hasTasksMembership(model.taskIds, vkUserId))) {
      throw new BadRequestException();
    }
    await this.taskService.finishTasks(model.taskIds, vkUserId, model.listId);
  }

  @Delete('/task')
  async deleteTask(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Query(
      'taskId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    taskId: number,
    @Query(
      'listId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    listId: number,
  ) {
    if (!(await this.taskService.hasTasksMembership([taskId], vkUserId))) {
      throw new BadRequestException();
    }

    await this.taskService.deleteTask(taskId, vkUserId, listId);
  }
}
