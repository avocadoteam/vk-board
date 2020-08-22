import { createSelector, defaultMemoize } from 'reselect';
import { getStateUi } from './common';
import { platform, OS } from '@vkontakte/vkui';

export const getNotifications = createSelector(getStateUi, (ui) => ui.notifications);

export const getAppId = createSelector(getStateUi, (ui) => ui.appId);

// export const isPlatformIOS = defaultMemoize(() => platform() === OS.IOS);
export const isPlatformIOS = defaultMemoize(() => false);
