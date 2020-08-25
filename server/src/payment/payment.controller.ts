import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Query,
  ParseIntPipe,
  HttpStatus,
  Post,
  Body,
  Res,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { SignGuard } from 'src/guards/sign.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { PaymentService } from './payment.service';
import { PaymentRequiredException } from 'src/exceptions/Payment.exception.';
import { Response } from 'express';
import integrationConfig from 'src/config/integration.config';
import { ConfigType } from '@nestjs/config';
import { avacadoGroupId } from 'src/constants';
import { VkCallbackGuard } from 'src/guards/vkCb.guard';

@Controller('api/payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @Inject(integrationConfig.KEY)
    private config: ConfigType<typeof integrationConfig>,
  ) {}

  @UseGuards(SignGuard)
  @UseInterceptors(TransformInterceptor)
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

  @UseGuards(SignGuard)
  @UseInterceptors(TransformInterceptor)
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

  @UseGuards(VkCallbackGuard)
  @Post('/finished')
  makePayment(
    @Body()
    model: {
      type: 'vkpay_transaction' | 'confirmation';
      group_id: number;
      object?: {
        from_id: number;
        amount: string;
        description?: string;
        date: string;
      };
    },
    @Res()
    res: Response,
  ) {
    if (model.group_id !== avacadoGroupId) {
      throw new BadRequestException();
    }

    if (model.type === 'confirmation') {
      res.setHeader('content-type', 'text/plain');
      return res.status(HttpStatus.OK).send(`${this.config.vkConfirmCode}`);
    }

    if (model.type === 'vkpay_transaction' && model.object) {
      this.paymentService.makePremium(
        model.object.from_id,
        model.object.amount,
      );
    }
    res.status(HttpStatus.OK).send('ok');
  }
}
