import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { ConfigProvider } from '@vkontakte/vkui';
import { Router } from 'modules/routes';
import { initSentry } from 'core/sentry';

const App = React.memo(() => {
  React.useEffect(() => {
    initSentry();
  }, []);
  return (
    <ConfigProvider isWebView>
      <Router />
    </ConfigProvider>
  );
});

export default App;
