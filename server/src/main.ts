const dotenv = require('dotenv');
dotenv.config();
if (process.env.NODE_ENV === 'production') {
  require('newrelic');
  require('./newrelic');
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const helmet = require('helmet');
import { ValidationPipe } from '@nestjs/common';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import * as logger from 'morgan';

// TODO: add seeds

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);

  app.use(
    helmet({
      frameguard: false,
    }),
  );
  app.use(logger('tiny'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const port = configService.get<number>('core.port', 3000);
  await app.listen(port, () => {
    console.log('Server listen on port', port);
  });
}
bootstrap();
