import { createSelector, defaultMemoize, createStructuredSelector } from 'reselect';
import { getStateUi } from './common';
import { OS } from '@vkontakte/vkui';
import { platform } from 'core/utils';
import { FetchingStateName, FetchingDataType, FetchingStatus, AppState } from 'core/models';
import { ReceiveDataMap } from '@vkontakte/vk-bridge';

export const getNotifications = createSelector(getStateUi, (ui) => ui.notifications);

export const getAppId = createSelector(getStateUi, (ui) => ui.appId);

export const isPlatformIOS = defaultMemoize(() => platform() === OS.IOS);

const getAddToHomeInfoDataState = createSelector(
  getStateUi,
  (ui) =>
    (ui.fetchingDatas[FetchingStateName.AddToHomeInfo] ?? {}) as FetchingDataType<
      ReceiveDataMap['VKWebAppAddToHomeScreenInfo']
    >
);
const getAddToHomeDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.AddToHome] ?? {}) as FetchingDataType<boolean>
);

export const isAddToHomeAvailable = createSelector(
  getAddToHomeInfoDataState,
  (dataState) => !!dataState.data?.is_feature_supported
);

export const canAddToHomeScreen = createSelector(
  getAddToHomeInfoDataState,
  (dataState) => !dataState.data?.is_added_to_home_screen
);

export const isAddToHomeUpdating = createSelector(
  getAddToHomeDataState,
  getAddToHomeInfoDataState,
  (info, action) =>
    info.status === FetchingStatus.Updating || action.status === FetchingStatus.Updating
);

export const addToHomeInfo = createStructuredSelector<
  AppState,
  {
    available: boolean;
    canAdd: boolean;
    updating: boolean;
  }
>({
  available: isAddToHomeAvailable,
  canAdd: canAddToHomeScreen,
  updating: isAddToHomeUpdating,
});
