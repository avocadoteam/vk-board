import {
  Controller,
  UseGuards,
  Get,
  UseInterceptors,
  Query,
  ParseIntPipe,
  HttpStatus,
  Put,
  Body,
  BadRequestException,
  Delete,
  CacheTTL,
  Post,
} from '@nestjs/common';
import { SignGuard } from 'src/guards/sign.guard';
import { ListService } from './list.service';
import { TasksService } from 'src/tasks/tasks.service';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import {
  FinishTasksModel,
  NewTaskModel,
  UpdateTaskModel,
} from 'src/contracts/task';
import { TasksCacheInterceptor } from 'src/interceptors/cache.interceptor';
import { DropMembershipModel, CreateMembershipModel } from 'src/contracts/list';

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
    if (!(await this.listService.hasListMembership([listId], vkUserId))) {
      throw new BadRequestException();
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
    if (!(await this.listService.hasListMembership([model.listId], vkUserId))) {
      throw new BadRequestException();
    }
    await this.taskService.finishTasks(model.taskIds, vkUserId, model.listId);
  }

  @Post('/task')
  async createTask(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: NewTaskModel,
  ) {
    if (!(await this.listService.hasListMembership([model.listId], vkUserId))) {
      throw new BadRequestException();
    }
    return this.taskService.createTask(model, vkUserId);
  }

  @Put('/task')
  async updateTask(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: UpdateTaskModel,
  ) {
    if (!(await this.listService.hasListMembership([model.listId], vkUserId))) {
      throw new BadRequestException();
    }
    await this.taskService.updateTask(model, vkUserId);
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
    if (!(await this.listService.hasListMembership([listId], vkUserId))) {
      throw new BadRequestException();
    }

    await this.taskService.deleteTask(taskId, vkUserId, listId);
  }

  @Delete('/membership')
  async dropMembership(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: DropMembershipModel,
  ) {
    if (!(await this.listService.isListOwner([model.listId], vkUserId))) {
      throw new BadRequestException();
    }

    await this.listService.dropMembership(model, vkUserId);
  }

  @Delete()
  async deleteList(
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
    if (!(await this.listService.isListOwner([listId], vkUserId))) {
      throw new BadRequestException();
    }

    await this.listService.deleteList(listId, vkUserId);
  }

  @Post('/membership')
  async createMembership(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: CreateMembershipModel,
  ) {
    if (await this.listService.hasListMembershipByGUID(model.guid, vkUserId)) {
      throw new BadRequestException();
    }
    return this.listService.createMembership(model, vkUserId);
  }
}
