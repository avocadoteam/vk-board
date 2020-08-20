import { createSelector } from 'reselect';
import { getStateUi } from './common';
import { FetchingStateName, FetchingDataType, FetchingStatus } from 'core/models';
import { UserInfo } from '@vkontakte/vk-bridge';

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
    status === FetchingStatus.Updating || keysStatus == FetchingStatus.Updating
);
export const getUserInfo = createSelector(getUserDataState, (userData) => userData.data);
export const getUserId = createSelector(getUserDataState, (userData) => userData.data?.id ?? 0);

export const getUserHash = createSelector(getStateUi, (ui) => ui.hash);

export const getQToQuery = createSelector(getStateUi, (ui) => ui?.initialQuery ?? '');
