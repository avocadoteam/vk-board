import { client } from 'core/callbacks';
import { store } from 'core/store';

client.new_task = (taskId) => {
  console.warn(taskId, 'new_task');
};

client.stop_g_sync = () => {
  console.warn('stop_g_sync');
  store.dispatch({ type: 'SET_GOOGLE_SYNC', payload: false });
};
