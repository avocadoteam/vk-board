import React from 'react';
import { Snackbar, Avatar } from '@vkontakte/vkui';
import Icon24ErrorCircle from '@vkontakte/icons/dist/24/error_circle';
import { useSelector, useDispatch } from 'react-redux';
import { getStateUi } from 'core/selectors/common';
import { AppDispatchActions } from 'core/models';
import { useFela } from 'react-fela';

const showDuration = 3500;

export const SnakbarsErr = React.memo(() => {
  const [visible, setVisible] = React.useState(false);
  const [humanError, setError] = React.useState('');
  const dispatch = useDispatch<AppDispatchActions>();
  const errorsQueue = useSelector(getStateUi).errorsQueue;
  const { css } = useFela();

  React.useEffect(() => {
    if (errorsQueue.length > 0 && !visible) {
      setError(errorsQueue[0] ?? '');
      setVisible(true);
      dispatch({
        type: 'DEQUEUE_ERROR',
        payload: errorsQueue[0],
      });
    } else if (!errorsQueue.length && visible) {
      setVisible(true);
    }
  }, [errorsQueue, visible]);

  if (!visible) {
    return null;
  }

  return (
    <>
      <Snackbar
        layout="vertical"
        onClose={() => setVisible(false)}
        before={
          <Avatar size={24}>
            <Icon24ErrorCircle fill="#FF4848" width={24} height={24} />
          </Avatar>
        }
        className={css({ zIndex: 105 })}
        duration={showDuration}
      >
        {humanError}
      </Snackbar>
    </>
  );
});
