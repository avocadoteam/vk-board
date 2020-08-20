import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SignGuard } from './guards/sign.guard';
import { join } from 'path';

@Controller()
@UseGuards(SignGuard)
export class AppController {
  @Get(['', 'listMembership'])
  root(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'public') + '/index.html');
  }
}
