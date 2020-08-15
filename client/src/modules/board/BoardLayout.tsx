import React from 'react';
import { BoardLists } from './BoardLists';
import { BoardActions } from './BoardActions';

export const BoardLayout = React.memo(() => {
  return (
    <>
      <BoardLists />
      <BoardActions />
    </>
  );
});
