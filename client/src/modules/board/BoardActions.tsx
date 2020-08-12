import React from 'react';
import { Div, Group, Separator } from '@vkontakte/vkui';
import Icon24List from '@vkontakte/icons/dist/24/list';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import { useFela } from 'react-fela';
import { Button } from 'atoms/Button';
import { useDispatch } from 'react-redux';
import { AppDispatchActions, ActiveModal } from 'core/models';
export const BoardActions = React.memo(() => {
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();

  const openListsModal = React.useCallback(() => {
    dispatch({
      type: 'SET_MODAL',
      payload: ActiveModal.Lists,
    });
  }, [dispatch]);

  return (
    <>
      <Separator wide />
      <Div>
        <Group>
          <span className={css({ display: 'flex' })}>
            <Button mode="primary" size="xl" stretched before={<Icon24Add />}>
              Новая задача
            </Button>
            <Button mode="tertiary" onClick={openListsModal}>
              <Icon24List />
            </Button>
          </span>
        </Group>
      </Div>
    </>
  );
});
