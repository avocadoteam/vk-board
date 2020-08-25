import React from 'react';
import { ModalPage, Div, Header, MiniInfoCell, Text } from '@vkontakte/vkui';
import { useFela } from 'react-fela';
import { useSelector, useDispatch } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import { Button } from 'atoms/Button';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { goBack } from 'connected-react-router';

export const DeleteList = React.memo<{ id: string }>(({ id }) => {
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);
  const dispatch = useDispatch<AppDispatchActions>();

  const back = React.useCallback(() => {
    dispatch(goBack() as any);
  }, [dispatch]);

  const deleteList = React.useCallback(() => {
    back();
    dispatch({
      type: 'SET_UPDATING_DATA',
      payload: FetchingStateName.DeleteBoardList,
    });
  }, [dispatch, back]);

  return (
    <ModalPage
      id={id}
      onClose={back}
      header={
        <Div>
          <Header
            className={`useMonrope manropeBold ${css({
              textAlign: 'center',
              '>div>div': { fontSize: '20px !important' },
              '>div': {
                display: 'block',
              },
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
            Это удалит список, вернуть его не получится.
          </Text>
        </MiniInfoCell>
      </Div>
      <Div className={css({ padding: '12px 24px', display: 'flex' })}>
        <Button
          mode="overlay_outline"
          onClick={back}
          size="xl"
          className={css({ marginRight: '10px' })}
        >
          Назад
        </Button>
        <Button onClick={deleteList} mode="destructive" size="xl">
          Удалить
        </Button>
      </Div>
    </ModalPage>
  );
});
