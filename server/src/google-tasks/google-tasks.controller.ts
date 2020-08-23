import {
  Controller,
  Get,
  Res,
  Query,
  Req,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { GoogleTasksService } from './google-tasks.service';
import { Response, Request } from 'express';
import { PaymentService } from 'src/payment/payment.service';
import { syncRestrictionHours } from 'src/constants/premium';
import { ruSyntaxHelper } from 'src/utils/lang';
import { PaymentRequiredException } from 'src/exceptions/Payment.exception.';

@Controller('google')
export class GoogleTasksController {
  constructor(
    private readonly googleService: GoogleTasksService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('/auth')
  async goToGoogleAuth(
    @Res() res: Response,
    @Req() req: Request,
    @Query(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    userId: number,
  ) {
    if (!(await this.paymentService.hasUserPremium(userId))) {
      throw new PaymentRequiredException();
    }

    res.redirect(this.googleService.googleAuthFirstStep(req.hostname, userId));
  }

  @Get('/complete')
  async completeGoogleAuth(
    @Query('code') code: string,
    @Query('state') userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const intUserId = Number(userId);
    if (typeof intUserId !== 'number' || isNaN(intUserId)) {
      throw new Error(`Invalid user id parameter ${userId}`);
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
      res.send(respMessage);
    } else {
      const computedTime = Math.trunc(24 - time);
      const humanTime = computedTime > 1 ? computedTime : 1;
      res.send(`
      <h1>Вы сможете синхронизировать google tasks только через
              ${humanTime} ${
        ruSyntaxHelper(humanTime) === 'single'
          ? 'час'
          : ruSyntaxHelper(humanTime) === 'singlePlural'
          ? 'часа'
          : 'часов'
      }</h1>`);
    }
  }
}
