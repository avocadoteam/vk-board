import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/minimal';
import { Request } from 'express';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      tap(null, exception => {
        Sentry.captureException(exception, {
          extra: {
            path: request.path,
            ...(request.query ?? {}),
          },
        });
      }),
    );
  }
}
