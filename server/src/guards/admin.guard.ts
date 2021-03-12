import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import * as moment from 'moment';
import { and, not, or } from 'ramda';
import { Observable } from 'rxjs';
import coreConfig from 'src/config/core.config';
import { creatorId } from 'src/constants';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @Inject(coreConfig.KEY)
    private core: ConfigType<typeof coreConfig>,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const vkUserId = request.query['vk_user_id'] as string;
    const unixts = request.query['vk_ts'] as string;
    const isOlderThan5days =
      moment().diff(moment.unix(Number(unixts)), 'days') >= 5;

    return or(
      and(`${creatorId}` === vkUserId, not(isOlderThan5days)),
      this.core.devMode,
    );
  }
}
