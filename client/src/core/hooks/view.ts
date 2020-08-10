import { useState, useMemo } from 'react';
import { vkBridge } from 'core/vk-bridge/instance';

export const useViewChange = <T = {}>(viewEnum: T, defaultKeyView: keyof T, withSwipe = false) => {
  const defaultView = useMemo(() => viewEnum[defaultKeyView], [viewEnum, defaultKeyView]);

  const [viewState, setView] = useState({
    activePanel: defaultView,
    history: [defaultView],
  });

  const goBack = () => {
    if (viewState.history.length === 1) {
      return;
    }
    const history = [...viewState.history];
    history.pop();

    const activePanel = history[history.length - 1];
    if (activePanel === defaultView && withSwipe) {
      vkBridge.send('VKWebAppDisableSwipeBack');
    }
    setView({ history, activePanel });
  };

  const goForward = (activePanel: T[keyof T]) => {
    const history = [...viewState.history];
    history.push(activePanel);

    if (viewState.activePanel === defaultView && withSwipe) {
      vkBridge.send('VKWebAppEnableSwipeBack');
    }
    setView({ history, activePanel });
  };

  return {
    goBack,
    goForward,
    activeView: viewState.activePanel,
    history: viewState.history,
  };
};
