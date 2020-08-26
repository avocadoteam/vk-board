import { clientPerformCallback } from 'core/socket/callbacks';
import { BoardTaskItem, TaskInfo, ListUpdatedParams } from 'core/models';

export const client = clientPerformCallback((m) => ({
  new_task: m<(task: BoardTaskItem) => void>(),
  stop_g_sync: m<() => void>(),
  payment_complete: m<() => void>(),
  finish_tasks: m<({ taskIds }: { taskIds: string[] }) => void>(),
  update_task: m<(task: TaskInfo) => void>(),
  delete_task: m<(taskId: string) => void>(),
  unfinish_tasks: m<({ taskIds }: { taskIds: string[] }) => void>(),
  list_updated: m<(params: ListUpdatedParams) => void>(),
}));
