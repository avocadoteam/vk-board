import React from 'react';
import { useInterval } from 'core/hooks';
import { FINISH_TASK_TIMER_VALUE, AppDispatchActions } from 'core/models';
import { Progress } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import { getBoardUiState } from 'core/selectors/common';

export const ListProgress = React.memo(() => {
  const { tasksToBeFinishedTimer } = useSelector(getBoardUiState);
  const dispatch = useDispatch<AppDispatchActions>();

  useInterval(
    () => {
      if (tasksToBeFinishedTimer > 0) {
        dispatch({ type: 'SET_FINISH_TASK_TIMER', payload: tasksToBeFinishedTimer - 5 });
      }
    },
    tasksToBeFinishedTimer > 0 ? 5 : null
  );

  const calcValue = Number(((tasksToBeFinishedTimer / FINISH_TASK_TIMER_VALUE) * 100).toFixed(0));

  return <Progress value={calcValue} />;
});
