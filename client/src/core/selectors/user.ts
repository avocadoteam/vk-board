import { createSelector } from 'reselect';
import { getStateUi } from './common';
import { FetchingStateName, FetchingDataType } from 'core/models';
import { UserInfo } from '@vkontakte/vk-bridge';

const getUserDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.User] ?? {}) as FetchingDataType<UserInfo>
);

export const getUserDataStatus = createSelector(getUserDataState, (userData) => userData.status);
export const getUserInfo = createSelector(getUserDataState, (userData) => userData.data);
export const getUserId = createSelector(getUserDataState, (userData) => userData.data?.id);

export const getUserHash = createSelector(getStateUi, (ui) => ui.hash);

export const getQToQuery = createSelector(getStateUi, (ui) => ui?.initialQuery ?? '');
