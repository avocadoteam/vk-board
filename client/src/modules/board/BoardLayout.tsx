import React from 'react';
import { PanelHeader } from '@vkontakte/vkui';
import { BoardLists } from './BoardLists';
import { BoardActions } from './BoardActions';

export const BoardLayout = React.memo(() => {
  return (
    <>
      <PanelHeader separator={false} />
      <BoardLists />
      <BoardActions />
    </>
  );
});
