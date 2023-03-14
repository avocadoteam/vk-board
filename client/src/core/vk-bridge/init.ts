import { AppearanceSchemeType, ChangeFragmentResponse } from '@vkontakte/vk-bridge';
import { FetchingStateName } from 'core/models';
import { selectedBoardListInfo } from 'core/selectors/boardLists';
import { getUserId } from 'core/selectors/user';
import { joinRoom } from 'core/socket/list';
import { store } from 'core/store';
import { vkBridge } from './instance';

// set client theme
vkBridge.subscribe(({ detail: { type, data } }) => {
  if (type === 'VKWebAppUpdateConfig') {
    const schemeAttribute = document.createAttribute('scheme');
    const unknownData = data as any;
    let theme: AppearanceSchemeType = unknownData.scheme ? unknownData.scheme : 'bright_light';
    theme =
      theme === 'vkcom_dark' ? 'space_gray' : theme === 'vkcom_light' ? 'bright_light' : theme;
    schemeAttribute.value = theme;
    document.body.attributes.setNamedItem(schemeAttribute);

    store.dispatch({ type: 'SET_THEME', payload: theme });

    if (vkBridge.supports('VKWebAppSetViewSettings')) {
      const isLight = theme === 'bright_light';
      vkBridge.send('VKWebAppSetViewSettings', {
        status_bar_style: isLight ? 'dark' : 'light',
        action_bar_color: isLight ? '#ffffff' : '#191919',
      });
    }
  }

  if (type === 'VKWebAppViewRestore') {
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

  if (type === 'VKWebAppChangeFragment') {
    const hashListGUID = (data as ChangeFragmentResponse).location;
    store.dispatch({
      type: 'SET_HASH',
      payload: hashListGUID ?? null,
    });
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
