import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  CacheTTL,
  Query,
  ParseIntPipe,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { SignGuard } from 'src/guards/sign.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { BoardCacheInterceptor } from 'src/interceptors/cache.interceptor';
import { ListService } from 'src/list/list.service';
import { NewListModel } from 'src/contracts/list';
import { TasksService } from 'src/tasks/tasks.service';
import { NewTaskModel } from 'src/contracts/task';

@Controller('api/board')
@UseGuards(SignGuard)
@UseInterceptors(TransformInterceptor)
export class BoardController {
  constructor(
    private readonly listService: ListService,
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  @UseInterceptors(BoardCacheInterceptor)
  @CacheTTL(10)
  getAvailableBoards(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
  ) {
    return this.listService.getLists(vkUserId);
  }

  @Post('/task')
  createTask(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: NewTaskModel,
  ) {
    return this.tasksService.createTask(model, vkUserId);
  }

  @Post('/list')
  createListOnBoard(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: NewListModel,
  ) {
    return this.listService.createList(model, vkUserId);
  }
}
