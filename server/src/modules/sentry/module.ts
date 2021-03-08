import { DynamicModule, Module } from '@nestjs/common';
import { SentryCoreModule } from './core';
import { SentryModuleAsyncOptions, SentryModuleOptions } from './interfaces';

@Module({})
export class SentryModule {
  public static forRoot(options: SentryModuleOptions): DynamicModule {
    return {
      module: SentryModule,
      imports: [SentryCoreModule.forRoot(options)],
    };
  }

  public static forRootAsync(options: SentryModuleAsyncOptions): DynamicModule {
    return {
      module: SentryModule,
      imports: [SentryCoreModule.forRootAsync(options)],
    };
  }
}
