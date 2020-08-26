const dotenv = require('dotenv');
dotenv.config();
// if (process.env.NODE_ENV === 'production') {
//   require('newrelic');
//   require('./newrelic');
// }
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import * as logger from 'morgan';
import { RedisIoAdapter } from './adapters/redis-io.adapter';
import * as sentry from '@sentry/node';
import { SentryInterceptor } from './interceptors/sentry.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);

  sentry.init({
    dsn: configService.get<string>('integration.sentryDNS', ''),
    enabled: !configService.get<boolean>('core.devMode', true),
  });

  app.use(
    helmet({
      frameguard: false,
      contentSecurityPolicy: false,
    }),
  );
  app.use(logger('tiny'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.use(sentry.Handlers.errorHandler());
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.useGlobalInterceptors(new TimeoutInterceptor(), new SentryInterceptor());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const port = configService.get<number>('core.port', 3000);
  await app.listen(port, () => {
    console.log('Server listen on port', port);
  });
}
bootstrap();
