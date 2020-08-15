import { createSelector, createStructuredSelector } from 'reselect';
import { getStateUi } from './common';
import {
  FetchingStateName,
  FetchingDataType,
  BoardListIiem,
  FetchingStatus,
  AppState,
  BoardTaskItem,
} from 'core/models';

const getBoardListsDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.Board] ?? {}) as FetchingDataType<BoardListIiem[]>
);
const getPostNewTaskDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.NewTask] ?? {}) as FetchingDataType<number>
);
const getTasksDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.Tasks] ?? {}) as FetchingDataType<BoardTaskItem[]>
);

export const isBoardUpdating = createSelector(
  getBoardListsDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);

export const getBoardListData = createSelector(
  getBoardListsDataState,
  (dataState) => dataState.data ?? []
);
export const isTasksUpdating = createSelector(
  getTasksDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);

export const getTasksData = createSelector(getTasksDataState, (dataState) => dataState.data ?? []);

export const getOpenTasks = createSelector(getTasksData, (tasks) =>
  tasks.filter((t) => t.finished === null)
);
export const getFinishedTasksCount = createSelector(
  getTasksData,
  (tasks) => tasks.filter((t) => t.finished !== null).length
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
  getOpenTasks,
  (ui, data, tasks): BoardListIiem => {
    const currentList = data.find((bl) => bl.id === ui.board.selectedBoardListId);
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
    };
  }
);

export const getBoardUiState = createSelector(getStateUi, (ui) => ui.board);

export const getNewTaskValues = createSelector(getBoardUiState, (board) => board.newTask);

export const getSelectedTaskInfo = createSelector(getBoardUiState, (board) => board.selectedTask);
