import { createSelector, createStructuredSelector } from 'reselect';
import { getStateUi } from './common';
import {
  FetchingStateName,
  FetchingDataType,
  BoardListIiem,
  FetchingStatus,
  AppState,
} from 'core/models';

const getBoardListsDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.Board] ?? {}) as FetchingDataType<BoardListIiem[]>
);
const getPostNewTaskDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.NewTask] ?? {}) as FetchingDataType<number>
);

export const isBoardUpdating = createSelector(
  getBoardListsDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);

export const getBoardListData = createSelector(
  getBoardListsDataState,
  (dataState) => dataState.data ?? []
);

export const isNewTaskUpdating = createSelector(
  getPostNewTaskDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);
export const isNewTaskError = createSelector(
  getPostNewTaskDataState,
  (dataState) => dataState.status === FetchingStatus.Error
);
export const getNewTaskError = createSelector(
  getPostNewTaskDataState,
  (dataState) => dataState.error
);
export const getNewTaskData = createSelector(
  getPostNewTaskDataState,
  (dataState) => dataState.data
);

export const getNewTaskInfo = createStructuredSelector<
  AppState,
  {
    newTaskId: number;
    error: any;
    hasError: boolean;
    updating: boolean;
  }
>({
  newTaskId: getNewTaskData,
  error: getNewTaskError,
  hasError: isNewTaskError,
  updating: isNewTaskUpdating,
});

export const getBoardLists = createSelector(getBoardListData, (data) =>
  data.map((d) => ({
    name: d.name,
    id: d.id,
  }))
);

export const selectedBoardListInfo = createSelector(
  getStateUi,
  getBoardListData,
  (ui, data): BoardListIiem =>
    data.find((bl) => bl.id === ui.board.selectedBoardListId) ?? {
      id: 0,
      created: '',
      name: '',
      tasks: [],
    }
);

export const getBoardUiState = createSelector(getStateUi, (ui) => ui.board);

export const getNewTaskValues = createSelector(getBoardUiState, (board) => board.newTask);
