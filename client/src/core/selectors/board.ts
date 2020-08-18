import { createSelector } from 'reselect';
import { getStateUi, getBoardUiState } from './common';
import { FetchingStateName, FetchingDataType, BoardListIiem, FetchingStatus } from 'core/models';
import { getOpenTasks } from './task';

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

export const getBoardLists = createSelector(getBoardListData, (data) =>
  data.map((d) => ({
    name: d.name,
    id: d.id,
    listguid: d.listguid,
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
    };
  }
);

export const getNewTaskValues = createSelector(getBoardUiState, (board) => board.newTask);
export const getEditTaskValues = createSelector(getBoardUiState, (board) => board.editedTask);
