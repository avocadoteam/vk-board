import { vkBridge } from './instance';
import { store } from 'core/store';
import { ClientTheme } from 'core/models';
// import { selectedBoardListInfo } from 'core/selectors/boardLists';
// import { joinRoom, leaveRoom } from 'core/socket/list';

export const subsOnVkEvents = () => {
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

      // const { listguid } = selectedBoardListInfo(store.getState());
      // if (listguid) {
      //   joinRoom(listguid);
      // }
    }

    // if (type === 'VKWebAppViewHide') {
    //   const { listguid } = selectedBoardListInfo(store.getState());
    //   if (listguid) {
    //     leaveRoom(listguid);
    //   }
    // }
  });
};
