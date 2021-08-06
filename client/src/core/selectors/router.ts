import { appId } from 'core/models';
import { matchPath } from 'react-router';
import { createSelector } from 'reselect';
import { getStateRouter, getStateUi } from './common';

export const getLocationNotificationEnabled = createSelector(
  getStateRouter,
  (router) => Number((router?.location as any).query?.vk_are_notifications_enabled) ?? 0
);
export const getLocationVkAppId = createSelector(
  getStateRouter,
  (router) => Number((router?.location as any).query?.vk_app_id) || appId
);
export const getLocationUserId = createSelector(
  getStateRouter,
  (router) => Number((router?.location as any).query?.vk_user_id) || 0
);

export const getLocationPathName = createSelector(
  getStateRouter,
  (router) => router?.location.pathname ?? ''
);

export const getLocationMainPath = createSelector(getLocationPathName, (pathName) => {
  const match = matchPath<{ main: string }>(pathName, { path: '/:main' });
  return match ? match.params.main : null;
});

export const getLocationSubPath = createSelector(getLocationPathName, (pathName) => {
  const match = matchPath<{ sub: string }>(pathName, { path: '/:main/:sub' });
  return match ? match.params.sub : null;
});

export const getMainView = createSelector(getStateUi, (ui) => ui.mainView);
