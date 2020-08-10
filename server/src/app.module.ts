import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'src/config/db.config';
import cacheConfig from 'src/config/cache.config';
import coreConfig from 'src/config/core.config';
import integrationConfig from 'src/config/integration.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, cacheConfig, coreConfig, integrationConfig],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
