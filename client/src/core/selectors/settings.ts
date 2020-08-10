import { createSelector } from 'reselect';
import { getStateUi } from './common';

export const getNotifications = createSelector(getStateUi, (ui) => ui.notifications);

export const getAppId = createSelector(getStateUi, (ui) => ui.appId);
