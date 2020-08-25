import { createSelector, defaultMemoize } from 'reselect';
import { getStateUi } from './common';
import { OS } from '@vkontakte/vkui';
import { platform } from 'core/utils';

export const getNotifications = createSelector(getStateUi, (ui) => ui.notifications);

export const getAppId = createSelector(getStateUi, (ui) => ui.appId);

export const isPlatformIOS = defaultMemoize(() => platform() === OS.IOS);
