import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Query,
  ParseIntPipe,
  HttpStatus,
  Post,
  ConflictException,
  Body,
} from '@nestjs/common';
import { SignGuard } from 'src/guards/sign.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { PaymentService } from './payment.service';
import { NewPaymentModel } from 'src/contracts/payment';
import { PaymentRequiredException } from 'src/exceptions/Payment.exception.';

@Controller('api/payment')
@UseGuards(SignGuard)
@UseInterceptors(TransformInterceptor)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getPaymentInfo(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
  ) {
    return this.paymentService.hasUserPremium(vkUserId);
  }

  @Get('/gSync')
  async getLastSyncInfo(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
  ) {
    if (!(await this.paymentService.hasUserPremium(vkUserId))) {
      throw new PaymentRequiredException();
    }
    return this.paymentService.getDurationOf24HoursBeforeNewSync(vkUserId);
  }

  @Post()
  async makePayment(
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    vkUserId: number,
    @Body()
    model: NewPaymentModel,
  ) {
    if (await this.paymentService.hasUserPremium(vkUserId)) {
      throw new ConflictException();
    }

    return this.paymentService.makePremium(vkUserId, model.amount);
  }
}
