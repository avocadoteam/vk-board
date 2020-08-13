import {
  Controller,
  UseGuards,
  Get,
  UseInterceptors,
  Query,
  ParseIntPipe,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { SignGuard } from 'src/guards/sign.guard';
import { ListService } from './list.service';
import { TasksService } from 'src/tasks/tasks.service';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

@Controller('api/list')
@UseGuards(SignGuard)
@UseInterceptors(TransformInterceptor)
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly taskService: TasksService,
  ) {}

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
}
