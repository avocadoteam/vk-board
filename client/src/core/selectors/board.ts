import { createSelector } from 'reselect';
import { getStateUi, getBoardUiState } from './common';
import { FetchingStateName, FetchingDataType, BoardListItem, FetchingStatus } from 'core/models';
import { getUserId, isUserDataUpdating } from './user';

const getBoardListsDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.Board] ?? {}) as FetchingDataType<BoardListItem[]>
);

export const isBoardUpdating = createSelector(
  getBoardListsDataState,
  isUserDataUpdating,
  (dataState, userUpdating) => dataState.status === FetchingStatus.Updating || userUpdating
);

export const getBoardListData = createSelector(
  getBoardListsDataState,
  (dataState) => dataState.data ?? []
);

export const getBoardLists = createSelector(getBoardListData, getUserId, (data, userId) =>
  data.map((d) => ({
    ...d,
    isOwner: d.createdBy === userId,
  }))
);

export const getNewTaskValues = createSelector(getBoardUiState, (board) => board.newTask);
export const getEditTaskValues = createSelector(getBoardUiState, (board) => board.editedTask);
