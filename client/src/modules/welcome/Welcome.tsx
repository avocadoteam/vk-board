import { Panel, View } from '@vkontakte/vkui';
import { goBack } from 'connected-react-router';
import { useViewChange } from 'core/hooks';
import { AppDispatchActions, WelcomeView } from 'core/models';
import { getWelcomeView } from 'core/selectors/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FirstList } from './FirstList';
import { WelcomeGreetings } from './WelcomeGreetings';

export const Welcome = React.memo(() => {
  const dispatch = useDispatch<AppDispatchActions>();
  const { goForward, goBack: swipeBack, history } = useViewChange(WelcomeView, 'Greetings', true);
  const activeView = useSelector(getWelcomeView);

  const back = React.useCallback(() => {
    swipeBack();
    dispatch(goBack() as any);
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
