import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { SENTRY_MODULE_OPTIONS } from './constants';
import { SentryModuleOptions } from './interfaces';
import * as Sentry from '@sentry/node';
import { Client, Options } from '@sentry/types';

@Injectable()
export class SentryService extends Logger {
  constructor(
    @Inject(SENTRY_MODULE_OPTIONS) private readonly options?: SentryModuleOptions,
    @Optional() prior?: SentryService,
  ) {
    super(SentryService.name);
    if (!options?.dsn) {
      super.error('Cannot start sentry module because no dns was provided');
      return;
    }
    const { debug, integrations = [], ...sentryOptions } = options;
    Sentry.init({
      ...sentryOptions,
      integrations: [
        new Sentry.Integrations.OnUncaughtException({
          onFatalError: async (err: Error) => {
            if (err.name === 'SentryError') {
              console.log(err);
            } else {
              (Sentry.getCurrentHub().getClient<Client<Options>>() as Client<Options>).captureException(err);
              process.exit(1);
            }
          },
        }),
        new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
        ...integrations,
      ],
    });
    if (options.enabled) {
      super.warn('Sentry module has been initialized');
    }
  }

  instance() {
    return Sentry;
  }

  log(message: string, context?: string) {
    message = `${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Log);
      super.log(message, context);
    } catch (err) {
      Sentry.captureException(err);
    }
  }

  error(message: string, trace?: string, context?: string) {
    message = `${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Error);
      super.error(message, trace, context);
    } catch (err) {}
  }

  warn(message: string, context?: string) {
    message = `${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Warning);
      super.warn(message, context);
    } catch (err) {
      Sentry.captureException(err);
    }
  }

  debug(message: string, context?: string) {
    message = `${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Debug);
      super.debug(message, context);
    } catch (err) {
      Sentry.captureException(err);
    }
  }

  verbose(message: string, context?: string) {
    message = `${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Info);
      super.verbose(message, context);
    } catch (err) {
      Sentry.captureException(err);
    }
  }

  addBreadcrumb = Sentry.addBreadcrumb;
  addGlobalEventProcessor = Sentry.addGlobalEventProcessor;
  captureEvent = Sentry.captureEvent;
  captureException = Sentry.captureException;
  close = Sentry.close;
  configureScope = Sentry.configureScope;
  flush = Sentry.flush;
  getCurrentHub = Sentry.getCurrentHub;
  getHubFromCarrier = Sentry.getHubFromCarrier;
  lastEventId = Sentry.lastEventId;
  setExtra = Sentry.setExtra;
  setExtras = Sentry.setExtras;
  setTag = Sentry.setTag;
  setTags = Sentry.setTags;
  setUser = Sentry.setUser;
  startTransaction = Sentry.startTransaction;
  withScope = Sentry.withScope;
}
