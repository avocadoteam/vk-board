import { store } from 'core/store';

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
