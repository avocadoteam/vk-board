import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import coreConfig from 'src/config/core.config';
import integrationConfig from 'src/config/integration.config';

@Injectable()
export class MarusyaGuard implements CanActivate {
  private readonly logger = new Logger(MarusyaGuard.name);

  constructor(
    @Inject(coreConfig.KEY)
    private core: ConfigType<typeof coreConfig>,
    @Inject(integrationConfig.KEY)
    private config: ConfigType<typeof integrationConfig>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const sameSecret =
      request.body.session.skill_id === this.config.marusyaSkillId;

    this.logger.log(`controller ${request.path} result ${sameSecret}`);

    return this.core.devMode || sameSecret;
  }
}
