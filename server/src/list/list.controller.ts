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
  UpdateTaskNotification,
  DeleteTaskModel,
} from 'src/contracts/task';
import { TasksCacheInterceptor } from 'src/interceptors/cache.interceptor';
import {
  DropMembershipModel,
  CreateMembershipModel,
  PreviewMembershipModel,
} from 'src/contracts/list';
import { RestricitionsService } from 'src/restricitions/restricitions.service';
import { PaymentRequiredException } from 'src/exceptions/Payment.exception';

@Controller('api/list')
@UseGuards(SignGuard)
@UseInterceptors(TransformInterceptor)
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly taskService: TasksService,
    private readonly restrictionService: RestricitionsService,
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
    if (!this.taskService.tryToValiadateBigInt(model.taskIds)) {
      throw new BadRequestException();
    }

    const taskIdsToUpdate = await this.listService.hasListMembershipWithTasks(
      [model.listId],
      model.taskIds,
      vkUserId,
    );
    if (!taskIdsToUpdate.length || taskIdsToUpdate.length !== model.taskIds.length) {
      throw new BadRequestException();
    }
    await this.taskService.finishTasks(taskIdsToUpdate, model.listId, vkUserId);
  }

  @Delete('/tasks')
  async unfinishTasks(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: FinishTasksModel,
  ) {
    if (!this.taskService.tryToValiadateBigInt(model.taskIds)) {
      throw new BadRequestException();
    }

    const taskIdsToUpdate = await this.listService.hasListMembershipWithTasks(
      [model.listId],
      model.taskIds,
      vkUserId,
    );
    if (!taskIdsToUpdate.length || taskIdsToUpdate.length !== model.taskIds.length) {
      throw new BadRequestException();
    }
    await this.taskService.unfinishTasks(
      taskIdsToUpdate,
      model.listId,
      vkUserId,
    );
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
    if (!this.taskService.tryToValiadateBigInt([model.id])) {
      throw new BadRequestException();
    }

    const taskIdsToUpdate = await this.listService.hasListMembershipWithTasks(
      [model.listId],
      [model.id],
      vkUserId,
    );
    if (!taskIdsToUpdate.length) {
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
    @Body()
    { listId, taskId }: DeleteTaskModel,
  ) {
    if (!this.taskService.tryToValiadateBigInt([taskId])) {
      throw new BadRequestException();
    }

    const taskIdsToUpdate = await this.listService.hasListMembershipWithTasks(
      [listId],
      [taskId],
      vkUserId,
    );
    if (!taskIdsToUpdate.length) {
      throw new BadRequestException();
    }

    await this.taskService.deleteTask(taskId, listId, vkUserId);
  }

  @Put('/task/notification')
  async putTaskNotification(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: UpdateTaskNotification,
  ) {
    if (!this.taskService.tryToValiadateBigInt([model.taskId])) {
      throw new BadRequestException();
    }

    const taskIdsToUpdate = await this.listService.hasListMembershipWithTasks(
      [model.listId],
      [model.taskId],
      vkUserId,
    );
    if (!taskIdsToUpdate.length) {
      throw new BadRequestException();
    }

    await this.taskService.updateNotificationTask(vkUserId, model);
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
    if (
      await this.listService.hasListMembershipBeforeJoin(model.listId, vkUserId)
    ) {
      throw new BadRequestException();
    }
    if (
      !(await this.restrictionService.canUserJoinList(vkUserId, model.listId))
    ) {
      throw new PaymentRequiredException();
    }
    return this.listService.createMembership(model, vkUserId);
  }

  @Get('/membership')
  async previewMembership(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Query()
    model: PreviewMembershipModel,
  ) {
    if (
      await this.listService.hasListMembershipBeforeJoinGUID(
        model.guid,
        vkUserId,
      )
    ) {
      throw new BadRequestException();
    }
    return this.listService.previewMembershipByGUID(model.guid);
  }
}
