import { client } from 'core/callbacks';
import { store } from 'core/store';
import { FetchingStateName } from 'core/models';

client.new_task = (taskId) => {
  console.warn(taskId, 'new_task');
};

client.stop_g_sync = () => {
  console.warn('stop_g_sync');
  store.dispatch({ type: 'SET_GOOGLE_SYNC', payload: false });
};
client.payment_complete = () => {
  console.warn('payment_complete');
  store.dispatch({
    type: 'SET_READY_DATA',
    payload: {
      name: FetchingStateName.PaymentProccess,
      data: true,
    },
  });
  store.dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.PaymentInfo });
  store.dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.LastGoogleSync });
};
