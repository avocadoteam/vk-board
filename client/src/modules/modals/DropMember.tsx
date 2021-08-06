import React from 'react';
import { ModalPage, Div, Header, MiniInfoCell, Text } from '@vkontakte/vkui';
import { useFela } from 'react-fela';
import { useSelector, useDispatch } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import { Button } from 'atoms/Button';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { getUserFirstNameToDelete } from 'core/selectors/membership';
import { goBack } from 'connected-react-router';
import { isPlatformIOS } from 'core/selectors/settings';

export const DropMember = React.memo<{ id: string }>(({ id }) => {
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);
  const dispatch = useDispatch<AppDispatchActions>();
  const name = useSelector(getUserFirstNameToDelete);

  const closeModal = React.useCallback(() => {
    if (isPlatformIOS()) {
      dispatch({ type: 'SET_MODAL', payload: null });
    } else {
      dispatch(goBack() as any);
    }
  }, [dispatch]);

  const dropMember = React.useCallback(() => {
    closeModal();
    dispatch({
      type: 'SET_UPDATING_DATA',
      payload: FetchingStateName.DropMembership,
    });
  }, [closeModal, dispatch]);

  return (
    <ModalPage
      id={id}
      onClose={closeModal}
      header={
        <Div>
          <Header
            className={`useMonrope manropeBold ${css({
              textAlign: 'center',
              '>div>div': { fontSize: '20px !important' },
              '>div': {
                display: 'block',
              },
              userSelect: 'none',
            } as any)}`}
          >
            {'Вы уверены?'}
          </Header>
        </Div>
      }
    >
      <Div>
        <MiniInfoCell before={null} multiline className={css({ padding: '0 12px' })}>
          <Text
            weight="medium"
            className={`useMonrope ${css({
              color: dark ? '#AEAEAE' : '#6A6A6A',
              textAlign: 'center',
            })}`}
          >
            {name} потеряет доступ к списку навсегда.
          </Text>
        </MiniInfoCell>
      </Div>
      <Div className={css({ padding: '12px 24px', display: 'flex' })}>
        <Button
          mode="overlay_outline"
          onClick={closeModal}
          size="xl"
          className={css({ marginRight: '10px' })}
        >
          Назад
        </Button>
        <Button onClick={dropMember} mode="destructive" size="xl">
          Удалить
        </Button>
      </Div>
    </ModalPage>
  );
});
