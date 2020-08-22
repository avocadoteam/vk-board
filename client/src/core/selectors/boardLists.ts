import { createSelector } from 'reselect';
import { getStateUi, getBoardUiState } from './common';
import { FetchingStateName, FetchingDataType, FetchingStatus, MaxFreeListsPerPerson } from 'core/models';
import { isBoardUpdating, getBoardLists } from './board';
import { getUserId } from './user';

const getNewListDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.NewBoardList] ?? {}) as FetchingDataType<boolean>
);
const getEditListDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.EditBoardList] ?? {}) as FetchingDataType<boolean>
);
const getDeleteListDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.DeleteBoardList] ?? {}) as FetchingDataType<boolean>
);
const getFirstListDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.FirstBoardList] ?? {}) as FetchingDataType<boolean>
);

export const isFirstListUpdating = createSelector(
  getFirstListDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);
export const isNewListUpdating = createSelector(
  getNewListDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);

export const isNewListCreated = createSelector(
  getNewListDataState,
  (dataState) => dataState.status === FetchingStatus.Ready && !!dataState.data
);

export const isEditListUpdating = createSelector(
  getEditListDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);

export const isEditListCreated = createSelector(
  getEditListDataState,
  (dataState) => dataState.status === FetchingStatus.Ready && !!dataState.data
);

export const isDeleteListUpdating = createSelector(
  getDeleteListDataState,
  isBoardUpdating,
  (dataState, boardUpdating) => dataState.status === FetchingStatus.Updating || boardUpdating
);

export const isListMembershipOpenedByOwner = createSelector(
  getBoardLists,
  getBoardUiState,
  (list, { boardListOpenId }) => list.find((l) => l.id === boardListOpenId)?.isOwner
);

export const getSelectedList = createSelector(getBoardUiState, (board) => board.selectedList);
export const getSelectedListTasks = createSelector(getSelectedList, (list) =>
  list.tasks.filter((t) => t.finished === null)
);
export const getFinishedListTasks = createSelector(getSelectedList, (list) =>
  list.tasks.filter((t) => t.finished !== null)
);
export const getSelectedListId = createSelector(getSelectedList, (list) => list.id);
export const selectedBoardListInfo = createSelector(getSelectedList, (list) => list.data);

export const canUserContinueCreateLists = createSelector(
  getBoardLists,
  getUserId,
  (data, userId) => data.filter(d => d.createdBy === userId).length < MaxFreeListsPerPerson
)