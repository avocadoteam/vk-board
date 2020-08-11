import React from 'react';
import { View, Panel } from '@vkontakte/vkui';
import { Offline } from './Offline';
import { useSelector } from 'react-redux';
import { getActiveMainView } from 'core/selectors/common';
import { MainView } from 'core/models';
import { BoardLayout } from 'modules/board';

export const Main = React.memo(() => {
  const activeView = useSelector(getActiveMainView);
  return (
    <View activePanel={activeView}>
      <Panel id={MainView.Board}>
        <BoardLayout />
      </Panel>
      <Panel id={MainView.Offline}>
        <Offline />
      </Panel>
    </View>
  );
});
