import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { createHash } from 'crypto';
import integrationConfig from 'src/config/integration.config';
import { NotificationType, PaymentVoice } from 'src/contracts/payment';
import { PaymentRequiredException } from 'src/exceptions/Payment.exception';
import { SignGuard } from 'src/guards/sign.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { PaymentService } from './payment.service';

@Controller('api/payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
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

  @Post('/ordered')
  async orderedPayment(
    @Req() req: any,
    @Body()
    model: PaymentVoice,
  ) {
    console.debug(model);
    console.debug(req.body);
    const { sig, ...newToSort } = model;

    const signString =
      Object.keys(newToSort)
        .sort()
        .map((k) => `${k}=${(newToSort as any)[k]}`)
        .join('') + this.config.vkSecretKey;

    const hash = createHash('md5').update(signString).digest('hex');

    console.debug(signString);
    console.debug(newToSort);
    this.logger.debug(`Lets check hash ${hash}`);
    this.logger.debug(`Lets check sig ${sig}`);

    if (sig !== hash) {
      return {
        error: {
          error_code: 10,
          critical: true,
        },
      };
    }

    switch (model.notification_type) {
      case NotificationType.GetItem:
      case NotificationType.GetItemTest:
        return {
          title: 'Премиум подписка',
          price: 100,
          discount: 50,
        };

      case NotificationType.OrderStatusChange:
      case NotificationType.OrderStatusChangeTest:
        if (model.status === 'chargeable') {
          this.logger.debug(`Lets make premium for  ${model.user_id}`);
          this.logger.debug(`Premium payment value ${model.item_price}`);
          const id = await this.paymentService.makePremium(
            model.user_id,
            `${Number(model.item_price) - Number(model.item_discount)}`,
          );

          return {
            order_id: model.order_id,
            app_order_id: id,
          };
        } else if (model.status === 'refunded') {
        } else {
          return {
            error: {
              error_code: 100,
              error_msg:
                'Передано непонятно что вместо chargeable или refunded.',
              critical: true,
            },
          };
        }

      default:
        break;
    }
  }
}
