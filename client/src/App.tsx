import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { ConfigProvider } from '@vkontakte/vkui';
import { Router } from 'modules/routes';
import { initSentry } from 'core/sentry';
import { useSelector } from 'react-redux';

const App = React.memo(() => {
  const scheme = useSelector((state) => state.ui.theme);

  React.useEffect(() => {
    initSentry();
  }, []);

  return (
    <ConfigProvider isWebView scheme={scheme}>
      <Router />
    </ConfigProvider>
  );
});

export default App;
