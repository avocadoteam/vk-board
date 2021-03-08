import { Inject } from '@nestjs/common';
import { SENTRY_TOKEN } from './constants';

export function InjectSentry() {
  return Inject(SENTRY_TOKEN);
}
