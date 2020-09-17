import { createSelector, createStructuredSelector } from 'reselect';
import {
  FetchingStateName,
  FetchingDataType,
  FetchingStatus,
  BoardTaskItem,
  AppState,
} from 'core/models';
import { getStateUi, getBoardUiState } from './common';

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
const getEditTaskDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.EditTask] ?? {}) as FetchingDataType<boolean>
);
const getNotifTaskDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.NotificationTask] ?? {}) as FetchingDataType<boolean>
);

export const isTasksUpdating = createSelector(
  getTasksDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);

export const getTasksData = createSelector(getTasksDataState, (dataState) => dataState.data ?? []);

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

export const isTaskNotifUpdating = createSelector(
  getNotifTaskDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);

export const isEditTaskUpdating = createSelector(
  getEditTaskDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);
export const isEditTaskError = createSelector(
  getEditTaskDataState,
  (dataState) => dataState.status === FetchingStatus.Error
);
export const getEditTaskError = createSelector(
  getEditTaskDataState,
  (dataState) => dataState.error
);

export const isNotSameSelectedAndEdit = createSelector(getBoardUiState, (board): boolean => {
  const { editedTask, selectedTask } = board;

  return !!(
    editedTask.name !== selectedTask.name ||
    editedTask.description !== selectedTask.description ||
    editedTask.dueDate !== selectedTask.dueDate
  );
});

export const isEditTaskReady = createSelector(
  getEditTaskDataState,
  (dataState) => dataState.status === FetchingStatus.Ready
);

export const getEditTaskInfo = createStructuredSelector<
  AppState,
  {
    notSameData: boolean;
    taskReady: boolean;
    error: any;
    hasError: boolean;
    updating: boolean;
  }
>({
  notSameData: isNotSameSelectedAndEdit,
  taskReady: isEditTaskReady,
  error: getEditTaskError,
  hasError: isEditTaskError,
  updating: isEditTaskUpdating,
});

export const getSelectedTaskInfo = createSelector(getBoardUiState, (board) => board.selectedTask);
export const getSelectedTaskId = createSelector(getSelectedTaskInfo, (task) => task.id);
export const getSelectedTaskNotification = createSelector(getSelectedTaskInfo, (task) => task.notification);
