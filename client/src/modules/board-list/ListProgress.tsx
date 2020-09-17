import { Progress } from '@vkontakte/vkui';
import { useInterval } from 'core/hooks';
import { AppDispatchActions, FINISH_TASK_TIMER_VALUE } from 'core/models';
import { getBoardUiStateTimer } from 'core/selectors/common';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const calcValue = (timer: number) => Number(((timer / FINISH_TASK_TIMER_VALUE) * 100).toFixed(0));
export const ListProgress = React.memo(() => {
  const timerState = useSelector(getBoardUiStateTimer);
  const [timer, setTimer] = useState(timerState);
  const dispatch = useDispatch<AppDispatchActions>();

  React.useEffect(() => {
    if (timer === 0) {
      dispatch({ type: 'SET_FINISH_TASK_TIMER', payload: 0 });
    }
  }, [timer]);

  useInterval(
    () => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    },
    timer > 0 ? 1 : null
  );

  return <Progress value={calcValue(timer)} />;
});
