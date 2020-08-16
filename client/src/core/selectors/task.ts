import { createSelector, createStructuredSelector } from 'reselect';
import {
  FetchingStateName,
  FetchingDataType,
  FetchingStatus,
  BoardTaskItem,
  AppState,
} from 'core/models';
import { getStateUi } from './common';

const getTaskDeleteDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.DeleteTask] ?? {}) as FetchingDataType<boolean>
);

const getPostNewTaskDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.NewTask] ?? {}) as FetchingDataType<number>
);
const getTasksDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.Tasks] ?? {}) as FetchingDataType<BoardTaskItem[]>
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

export const isTaskDeleteUpdating = createSelector(
  getTaskDeleteDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);
