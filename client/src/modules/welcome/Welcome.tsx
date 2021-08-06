import { Panel, View } from '@vkontakte/vkui';
import { goBack } from 'connected-react-router';
import { useViewChange } from 'core/hooks';
import { AppDispatchActions, WelcomeView } from 'core/models';
import { isPlatformIOS } from 'core/selectors/settings';
import { getWelcomeView } from 'core/selectors/views';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FirstList } from './FirstList';
import { WelcomeGreetings } from './WelcomeGreetings';

export const Welcome = React.memo(() => {
  const dispatch = useDispatch<AppDispatchActions>();
  const {
    goForward,
    goBack: swipeBack,
    history,
    activeView: welcomeView,
  } = useViewChange(WelcomeView, 'Greetings', true);
  const activeView = isPlatformIOS() ? welcomeView : useSelector(getWelcomeView);

  const back = React.useCallback(() => {
    swipeBack();
    if (!isPlatformIOS()) {
      dispatch(goBack() as any);
    }
  }, [dispatch, swipeBack]);

  return (
    <View activePanel={activeView} onSwipeBack={back} history={history}>
      <Panel id={WelcomeView.Greetings}>
        <WelcomeGreetings goForward={goForward} />
      </Panel>
      <Panel id={WelcomeView.TaskCreation}>
        <FirstList />
      </Panel>
    </View>
  );
});
