import { clientPerformCallback } from 'core/socket/callbacks';

export const client = clientPerformCallback(m => ({
  new_task: m<(taskId: string) => void>(),
}));
