import { createSelector } from 'reselect';
import { getStateUi } from './common';
import { FetchingStateName, FetchingDataType, FetchingStatus } from 'core/models';
import { UserInfo } from '@vkontakte/vk-bridge';
import { getLocationUserId } from './router';

const getUserDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.User] ?? {}) as FetchingDataType<UserInfo>
);
const getUserSKeysDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.UserSKeys] ?? {}) as FetchingDataType<undefined>
);

export const getUserDataStatus = createSelector(getUserDataState, (userData) => userData.status);
export const getUserSKeysDataStatus = createSelector(
  getUserSKeysDataState,
  (userData) => userData.status
);
export const isUserDataUpdating = createSelector(
  getUserDataStatus,
  getUserSKeysDataStatus,
  (status, keysStatus) =>
    status === FetchingStatus.Updating || keysStatus === FetchingStatus.Updating
);
export const getUserInfo = createSelector(getUserDataState, (userData) => userData.data);

export const getUserId = createSelector(
  getUserDataState,
  getLocationUserId,
  (userData, locationUserId) => userData.data?.id ?? locationUserId
);

export const getQToQuery = createSelector(getStateUi, (ui) => ui?.initialQuery ?? '');
