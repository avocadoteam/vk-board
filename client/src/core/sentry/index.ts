import * as sentry from '@sentry/browser';
import { Severity, User } from '@sentry/types';
import { store } from 'core/store';
import { UserInfo } from '@vkontakte/vk-bridge';
import { appV } from 'core/models';

export const captureUrlEvent = (message: string, request: sentry.Request = {}) => {
  // sentry.captureEvent({
  //   message,
  //   request,
  //   level: Severity.Error,
  // });
};

const beforeSend: sentry.BrowserOptions['beforeSend'] = (event) => {
  if (!event.message || event.message?.indexOf('ChunkLoadError') !== -1) {
    return null;
  }

  const state = store.getState();
  const { ui } = state;

  event.user =
    ui.fetchingDatas.user &&
    ({
      ...event.user,
      id: String((ui.fetchingDatas.user.data as UserInfo)?.id),
      username: (ui.fetchingDatas.user.data as UserInfo)?.first_name,
      fullName: (ui.fetchingDatas.user.data as UserInfo)?.last_name,
    } as User);

  event.extra = {
    ...event.extra,
    uiState: ui,
  };

  event.tags = event.tags || {};

  return event;
};

export async function initSentry() {
  return sentry.init({
    // dsn: 'https://e0a9247786274dd8bf9f8ce968cd182b@sr.testfriendship.special.vk-apps.com/2',
    dsn: '',
    release: appV.toString(),
    beforeSend,
    enabled: process.env.NODE_ENV === 'production',
    environment: 'production',
    ignoreErrors: [/Non-Error promise rejection captured with keys/i],
  });
}
