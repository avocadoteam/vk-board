import {
  Controller,
  Get,
  Res,
  Query,
  Req,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  Render,
  BadRequestException,
} from '@nestjs/common';
import { GoogleTasksService } from './google-tasks.service';
import { Response, Request } from 'express';
import { PaymentService } from 'src/payment/payment.service';
import { syncRestrictionHours } from 'src/constants/premium';
import { ruSyntaxHelper } from 'src/utils/lang';
import { PaymentRequiredException } from 'src/exceptions/Payment.exception';
import { SignGuard } from 'src/guards/sign.guard';

@Controller('gt')
export class GoogleTasksController {
  constructor(
    private readonly googleService: GoogleTasksService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('/policy')
  getPolicy(@Res() res: Response) {
    res.redirect('https://vk.com/privacy');
  }

  @Get('/terms')
  getTerms(@Res() res: Response) {
    res.redirect('https://vk.com/terms');
  }

  @UseGuards(SignGuard)
  @Get('/auth')
  async goToGoogleAuth(
    @Res() res: Response,
    @Req() req: Request,
    @Query(
      'vk_user_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    userId: number,
    @Query(
      'dark',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    dark: 1 | 0,
  ) {
    if (!(await this.paymentService.hasUserPremium(userId))) {
      throw new PaymentRequiredException();
    }

    res.redirect(
      this.googleService.googleAuthFirstStep(req.hostname, userId, dark),
    );
  }

  @Get('/complete')
  @Render('g')
  async completeGoogleAuth(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
  ) {
    const [userId, dark] = state.split(',');
    const intUserId = Number(userId);
    if (typeof intUserId !== 'number' || isNaN(intUserId) || !code) {
      throw new BadRequestException();
    }

    if (!(await this.paymentService.hasUserPremium(intUserId))) {
      throw new PaymentRequiredException();
    }

    const time = await this.paymentService.getDurationOf24HoursBeforeNewSync(
      intUserId,
    );

    if (time >= syncRestrictionHours) {
      const respMessage = await this.googleService.processGoogleLogin(
        code,
        req.hostname,
        intUserId,
      );
      return {
        message: respMessage,
        dark: Number(dark),
        notAvailable: false,
      };
    } else {
      const computedTime = Math.trunc(24 - time);
      const humanTime = computedTime > 1 ? computedTime : 1;
      return {
        message: `
      Вы сможете синхронизировать google tasks только через
              ${humanTime} ${
          ruSyntaxHelper(humanTime) === 'single'
            ? 'час'
            : ruSyntaxHelper(humanTime) === 'singlePlural'
            ? 'часа'
            : 'часов'
        }`,
        dark: Number(dark),
        notAvailable: true,
      };
    }
  }
}
