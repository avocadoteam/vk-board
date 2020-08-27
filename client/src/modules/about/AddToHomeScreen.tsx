import React from 'react';
import { SimpleCell, Spinner } from '@vkontakte/vkui';
import Icon16Add from '@vkontakte/icons/dist/16/add';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { addToHomeInfo } from 'core/selectors/settings';

export const AddToHomeScreen = React.memo(() => {
  const dispatch = useDispatch<AppDispatchActions>();
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
      after={updating ? <Spinner size="small" /> : <Icon16Add />}
      onClick={addToHome}
      disabled={!canAdd || updating}
    >
      {canAdd ? 'Добавьте шорткат на главный экран устройства' : 'Вы уже добавили шорткат'}
    </SimpleCell>
  );
});
