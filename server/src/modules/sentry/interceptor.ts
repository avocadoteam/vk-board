import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { HttpArgumentsHost, RpcArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import { Handlers, Scope } from '@sentry/node';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectSentry } from './decorator';
import { SentryService } from './service';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(@InjectSentry() private readonly client: SentryService) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    // first param would be for events, second is for errors
    return next.handle().pipe(
      tap(null, exception => {
        this.client.instance().withScope(scope => {
          switch (context.getType()) {
            case 'http':
              return this.captureHttpException(scope, context.switchToHttp(), exception);
            case 'rpc':
              return this.captureRcpException(scope, context.switchToRpc(), exception);
            case 'ws':
              return this.captureWsException(scope, context.switchToWs(), exception);
          }
        });
      }),
    );
  }

  private captureHttpException(scope: Scope, http: HttpArgumentsHost, exception: any): void {
    const data = Handlers.parseRequest(<any>{}, http.getRequest(), {});
    scope.setExtra('req', data.request);
    if (data.extra) scope.setExtras(data.extra);
    if (data.user) scope.setUser(data.user);
    this.client.captureException(exception);
  }

  private captureRcpException(scope: Scope, rcp: RpcArgumentsHost, exception: any): void {
    scope.setExtra('rcp_data', rcp.getData());
    this.client.captureException(exception);
  }

  private captureWsException(scope: Scope, ws: WsArgumentsHost, exception: any) {
    scope.setExtra('ws_client', ws.getClient());
    scope.setExtra('ws_data', ws.getData());
    this.client.captureException(exception);
  }
}
