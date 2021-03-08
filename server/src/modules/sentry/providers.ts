import { Provider } from '@nestjs/common';
import { SENTRY_TOKEN } from './constants';
import { SentryModuleOptions } from './interfaces';
import { SentryService } from './service';

export function createSentryProviders(options: SentryModuleOptions): Provider {
  return {
    provide: SENTRY_TOKEN,
    useValue: new SentryService(options),
  };
}
