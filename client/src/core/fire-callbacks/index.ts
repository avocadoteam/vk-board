import { client } from 'core/callbacks';

client.new_task = (taskId) => {
  console.warn(taskId, 'new_task');
};
