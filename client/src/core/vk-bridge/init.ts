import { goBack } from 'connected-react-router';
import { ActiveModal, activeModals, ClientTheme, FetchingStateName } from 'core/models';
import { selectedBoardListInfo } from 'core/selectors/boardLists';
import { getLocationSubPath } from 'core/selectors/router';
import { getUserId } from 'core/selectors/user';
import { joinRoom } from 'core/socket/list';
import { store } from 'core/store';
import { vkBridge } from './instance';

// set client theme
vkBridge.subscribe(({ detail: { type, data } }) => {
  if (type === 'VKWebAppUpdateConfig') {
    const schemeAttribute = document.createAttribute('scheme');
    const unknownData = data as any;
    const theme = unknownData.scheme ? unknownData.scheme : 'client_light';
    schemeAttribute.value = theme;
    document.body.attributes.setNamedItem(schemeAttribute);

    store.dispatch({ type: 'SET_THEME', payload: theme });

    if (vkBridge.supports('VKWebAppSetViewSettings')) {
      const isLight = theme !== ClientTheme.Dark;
      vkBridge.send('VKWebAppSetViewSettings', {
        status_bar_style: isLight ? 'dark' : 'light',
        action_bar_color: isLight ? '#ffffff' : '#191919',
      });
    }
  }

  if (type === 'VKWebAppViewRestore') {
    const hashListGUID = window.location.hash ? window.location.hash.split('#').pop() : null;
    store.dispatch({
      type: 'SET_HASH',
      payload: hashListGUID ?? null,
    });

    store.dispatch({
      type: 'SET_UPDATING_DATA',
      payload: FetchingStateName.PaymentInfo,
    });

    const state = store.getState();

    if (window.navigator.onLine) {
      store.dispatch({ type: 'SET_APP_CONNECT', payload: true });
    }

    const { listguid } = selectedBoardListInfo(state);
    const userId = getUserId(state);
    joinRoom(userId, listguid);
  }

  if (type === 'VKWebAppViewHide') {
    store.dispatch({
      type: 'SET_QUEUE_ERROR',
      payload: [],
    });
    store.dispatch({
      type: 'SET_SNACK',
      payload: false,
    });
  }
});

// Init VK  Mini App
vkBridge.send('VKWebAppInit');
