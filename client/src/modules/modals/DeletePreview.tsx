import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { MiniInfoCell, Text, Div, Spinner } from '@vkontakte/vkui';
import { Button } from 'atoms/Button';
import { isTaskDeleteUpdating } from 'core/selectors/task';
import { isThemeDrak } from 'core/selectors/common';

type Props = { deletedPreview: boolean; cancelDelete: () => void };

export const DeletePreview = React.memo<Props>(({ deletedPreview, cancelDelete }) => {
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();
  const deletting = useSelector(isTaskDeleteUpdating);
  const dark = useSelector(isThemeDrak);

  const deleteTask = React.useCallback(() => {
    dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.DeleteTask });
  }, [dispatch]);

  if (!deletedPreview) {
    return null;
  }

  return (
    <>
      <Div>
        <MiniInfoCell before={null} multiline className={css({ padding: '0 12px' })}>
          <Text
            weight="medium"
            className={`useMonrope ${css({
              color: dark ? '#AEAEAE' : '#6A6A6A',
              textAlign: 'center',
            })}`}
          >
            Это удалит задачу и вернуть её не получится.
          </Text>
        </MiniInfoCell>
      </Div>
      <Div className={css({ padding: '12px 24px', display: 'flex' })}>
        <Button
          mode="overlay_outline"
          disabled={deletting}
          onClick={cancelDelete}
          size="xl"
          className={css({ marginRight: '10px' })}
        >
          Назад
        </Button>
        <Button
          onClick={deleteTask}
          disabled={deletting}
          before={deletting ? <Spinner size="regular" /> : null}
          mode="destructive"
          size="xl"
        >
          Удалить
        </Button>
      </Div>
    </>
  );
});
