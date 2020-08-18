import { createSelector } from 'reselect';
import { getStateUi, getBoardUiState } from './common';
import { FetchingStateName, FetchingDataType, FetchingStatus } from 'core/models';
import { getBoardListData } from './board';
import { getUserId } from './user';

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
