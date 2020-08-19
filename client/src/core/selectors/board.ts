import { createSelector } from 'reselect';
import { getStateUi, getBoardUiState } from './common';
import { FetchingStateName, FetchingDataType, BoardListIiem, FetchingStatus } from 'core/models';
import { getOpenTasks } from './task';
import { getUserId } from './user';

const getBoardListsDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.Board] ?? {}) as FetchingDataType<BoardListIiem[]>
);

export const isBoardUpdating = createSelector(
  getBoardListsDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);

export const getBoardListData = createSelector(
  getBoardListsDataState,
  (dataState) => dataState.data ?? []
);

export const getBoardLists = createSelector(getBoardListData, getUserId, (data, userId) =>
  data.map((d) => ({
    name: d.name,
    id: d.id,
    listguid: d.listguid,
    isOwner: d.createdBy === userId,
  }))
);

export const selectedBoardListInfo = createSelector(
  getBoardUiState,
  getBoardListData,
  getOpenTasks,
  (board, data, tasks): BoardListIiem => {
    const currentList = data.find((bl) => bl.id === board.selectedBoardListId);
    if (!!currentList) {
      return {
        ...currentList,
        tasks,
      };
    }
    return {
      id: 0,
      created: '',
      name: '',
      tasks: [],
      memberships: [],
      listguid: '',
      createdBy: 0,
    };
  }
);

export const getNewTaskValues = createSelector(getBoardUiState, (board) => board.newTask);
export const getEditTaskValues = createSelector(getBoardUiState, (board) => board.editedTask);
