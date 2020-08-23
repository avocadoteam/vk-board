import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { ConfigProvider } from '@vkontakte/vkui';
import { Router } from 'modules/routes';
import { initSentry } from 'core/sentry';
import { ClientTheme, AppDispatchActions } from 'core/models';
import { vkBridge } from 'core/vk-bridge/instance';
import { useSelector, useDispatch } from 'react-redux';

const lights = [ClientTheme.Light, ClientTheme.oldLight];
const hashListGUID = window.location.hash ? window.location.hash.split('#').pop() : null;

const App = React.memo(() => {
  const theme = useSelector((state) => state.ui.theme);
  const dispatch = useDispatch<AppDispatchActions>();

  const changeTheme = (payload: ClientTheme) => {
    dispatch({
      type: 'SET_THEME',
      payload,
    });
  };
  React.useEffect(() => {
    
    vkBridge.send('VKWebAppInit');
    vkBridge.subscribe(({ detail: { type, data } }) => {
      if (type === 'VKWebAppUpdateConfig') {
        const dataScheme = (data as any).scheme;
        let isLight = lights.includes(dataScheme);

        changeTheme(isLight ? ClientTheme.Light : ClientTheme.Dark);

        vkBridge.send('VKWebAppSetViewSettings', {
          status_bar_style: isLight ? 'dark' : 'light',
          action_bar_color: isLight ? '#ffffff' : '#191919',
        });
      }

      if (type === 'VKWebAppViewRestore') {
        dispatch({
          type: 'SET_HASH',
          payload: hashListGUID ?? null,
        });

        // const { listguid } = selectedBoardListInfo(store.getState());
        // if (listguid) {
        //   joinRoom(listguid);
        // }
      }
    });
    initSentry();
  }, []);

  return (
    <ConfigProvider isWebView scheme={theme}>
      <Router />
    </ConfigProvider>
  );
});

export default App;
