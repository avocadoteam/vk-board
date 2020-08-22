import { Controller, Get, Res, Query, Req } from '@nestjs/common';
import { GoogleTasksService } from './google-tasks.service';
import { Response, Request } from 'express';

@Controller('google')
export class GoogleTasksController {
  constructor(private readonly googleService: GoogleTasksService) {}

  @Get('/auth')
  goToGoogleAuth(@Res() res: Response, @Req() req: Request) {
    res.redirect(this.googleService.googleAuthFirstStep(req.hostname));
  }

  @Get('/complete')
  async completeGoogleAuth(@Query('code') code: string, @Req() req: Request) {
    await this.googleService.processGoogleLogin(code, req.hostname);
  }
}
