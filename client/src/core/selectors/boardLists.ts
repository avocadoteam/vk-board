import { createSelector } from 'reselect';
import { getStateUi } from './common';
import { FetchingStateName, FetchingDataType, FetchingStatus } from 'core/models';

const getNewListDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.NewBoardList] ?? {}) as FetchingDataType<boolean>
);

export const isNewListUpdating = createSelector(
  getNewListDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);

export const isNewListCreated = createSelector(
  getNewListDataState,
  (dataState) => dataState.status === FetchingStatus.Ready && !!dataState.data
);
