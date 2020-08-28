import React from 'react';
import { SimpleCell, Spinner } from '@vkontakte/vkui';
import Icon16Add from '@vkontakte/icons/dist/16/add';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { addToHomeInfo } from 'core/selectors/settings';
import { isThemeDrak } from 'core/selectors/common';
import { useFela } from 'react-fela';

export const AddToHomeScreen = React.memo(() => {
  const dispatch = useDispatch<AppDispatchActions>();
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);
  const { available, canAdd, updating } = useSelector(addToHomeInfo);

  const addToHome = React.useCallback(
    () =>
      dispatch({
        type: 'SET_UPDATING_DATA',
        payload: FetchingStateName.AddToHome,
      }),
    [dispatch]
  );

  if (!available) {
    return null;
  }

  return (
    <SimpleCell
      after={
        updating ? (
          <Spinner
            size="small"
            className={css({
              '>div': {
                color: dark ? '#5F5F5F !important' : '#CFCFCF !important',
                padding: '0 !important',
              },
              padding: '10px 2px 10px 10px',
            } as any)}
          />
        ) : (
          <Icon16Add />
        )
      }
      onClick={addToHome}
      disabled={!canAdd || updating}
      multiline
    >
      {canAdd ? 'Добавьте шорткат на главный экран устройства' : 'Вы уже добавили шорткат'}
    </SimpleCell>
  );
});
