import React from 'react';
import { Div, Header, Group } from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import { selectedBoardListInfo } from 'core/selectors/board';

export const BoardLists = React.memo(() => {
  const info = useSelector(selectedBoardListInfo);
  return (
    <Div>
      <Group>
        <Header>{info.name}</Header>
      </Group>
    </Div>
  );
});
