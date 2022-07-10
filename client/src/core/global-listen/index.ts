import { store } from 'core/store';
import { vkBridge } from 'core/vk-bridge/instance';

export const k = 'k';

window.addEventListener('offline', function (e) {
  console.log('offline');
  store.dispatch({ type: 'SET_APP_CONNECT', payload: false });
  store.dispatch({ type: 'HANDLE_ACTIVATE_INIT', payload: false });
});

window.addEventListener('online', function (e) {
  console.log('online');
  store.dispatch({ type: 'SET_APP_CONNECT', payload: true });
});

window.addEventListener('message', e => {
  try {
    if (!e.data || typeof e.data !== 'string') return;
    const data = JSON.parse(e.data);

    if (data.payload) {
      console.debug(data);
      vkBridge.send('VKWebAppOpenPayForm', { ...data.payload, app_id: 7566928 });
    }
  } catch (error) {
    console.debug(error);
  }
});
