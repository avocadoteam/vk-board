import { BoardTaskItem, TaskInfo } from '../task';

export enum NameSpaces {
  SelctedList = '/selectedList',
}

export enum SocketEvents {
  new_task = 'new_task',
  stop_g_sync = 'stop_g_sync',
  payment_complete = 'payment_complete',
  finish_tasks = 'finish_tasks',
  unfinish_tasks = 'unfinish_tasks',
  update_task = 'update_task',
  delete_task = 'delete_task',
}

export enum BusEvents {
  NEW_TASK = 'new_task',
  FINISH_TASKS = 'finish_tasks',
  UNFINISH_TASKS = 'unfinish_tasks',
  UPDATE_TASK = 'update_task',
  DELETE_TASK = 'delete_task',
  STOP_G_SYNC = 'stop_g_sync',
  PAYMENT_COMPLETE = 'payment_complete',
}

export type NewTaskParams = {
  task: BoardTaskItem;
  listGUID: string;
};
export type UpdateTaskParams = {
  task: TaskInfo;
  listGUID: string;
};
export type FinishTaskParams = {
  taskIds: string[];
  listGUID: string;
};
