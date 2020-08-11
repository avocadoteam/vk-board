import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from 'src/config/db.config';
import cacheConfig from 'src/config/cache.config';
import coreConfig from 'src/config/core.config';
import integrationConfig from 'src/config/integration.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, cacheConfig, coreConfig, integrationConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.dbName'),
        entities: [__dirname + '/db/tables/*{.ts,.js}'],
        synchronize: configService.get<boolean>('core.devMode')
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
