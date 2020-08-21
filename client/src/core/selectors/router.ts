import { createSelector, createStructuredSelector } from 'reselect';
import { getStateRouter, getStateUi } from './common';
import { matchPath } from 'react-router';
import { AppState, appId, MainView } from 'core/models';

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

export const getLocationPathes = createStructuredSelector<
  AppState,
  { main: string | null; sub: string | null }
>({
  main: getLocationMainPath,
  sub: getLocationSubPath,
});

export const getActiveMainView = createSelector(getStateUi, getLocationMainPath, (ui, mainPath) => {
  if (!ui.online) {
    return MainView.Offline;
  }

  if (mainPath === null) {
    return MainView.Board;
  }

  switch (mainPath) {
    case MainView.ListMembership:
      return MainView.ListMembership;
    case MainView.ListSharePreview:
      return MainView.ListSharePreview;
    case MainView.About:
      return MainView.About;

    default:
      return MainView.Board;
  }
});
