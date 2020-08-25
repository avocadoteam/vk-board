import { clientPerformCallback } from 'core/socket/callbacks';

export const client = clientPerformCallback(m => ({
  new_task: m<(taskId: string) => void>(),
  stop_g_sync: m<() => void>(),
  payment_complete: m<() => void>(),
}));
