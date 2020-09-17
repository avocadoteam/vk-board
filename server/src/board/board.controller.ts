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
  Put,
  BadRequestException,
} from '@nestjs/common';
import { SignGuard } from 'src/guards/sign.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { BoardCacheInterceptor } from 'src/interceptors/cache.interceptor';
import { ListService } from 'src/list/list.service';
import { NewListModel, EditListModel } from 'src/contracts/list';
import { RestricitionsService } from 'src/restricitions/restricitions.service';
import { PaymentRequiredException } from 'src/exceptions/Payment.exception';

@Controller('api/board')
@UseGuards(SignGuard)
@UseInterceptors(TransformInterceptor)
export class BoardController {
  constructor(
    private readonly listService: ListService,
    private readonly restrictionsService: RestricitionsService,
  ) {}

  @Get()
  @UseInterceptors(BoardCacheInterceptor)
  @CacheTTL(60)
  getAvailableBoards(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
  ) {
    return this.listService.getLists(vkUserId);
  }

  @Post('/list')
  async createListOnBoard(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: NewListModel,
  ) {
    if (!await this.restrictionsService.canUserContinueCreateLists(vkUserId)) {
      throw new PaymentRequiredException();
    }
    return this.listService.createList(model, vkUserId);
  }

  @Put('/list')
  async editListNameOnBoard(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: EditListModel,
  ) {
    if (!(await this.listService.hasListMembership([model.listId], vkUserId))) {
      throw new BadRequestException();
    }
    return this.listService.editListName(model, vkUserId);
  }
}
