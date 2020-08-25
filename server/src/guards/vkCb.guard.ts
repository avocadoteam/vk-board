import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import * as qs from 'querystring';
import * as crypto from 'crypto';
import integrationConfig from '../config/integration.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class VkCallbackGuard implements CanActivate {
  private readonly logger = new Logger(VkCallbackGuard.name);

  constructor(
    @Inject(integrationConfig.KEY)
    private config: ConfigType<typeof integrationConfig>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    console.log(request.body, request.headers);

    return true;
  }
}
