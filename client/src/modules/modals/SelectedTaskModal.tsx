import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { ModalPage, Header, MiniInfoCell, Text, Div, Spinner } from '@vkontakte/vkui';
import { getSelectedTaskInfo } from 'core/selectors/board';
import Icon20ArticleOutline from '@vkontakte/icons/dist/20/article_outline';
import Icon20RecentOutline from '@vkontakte/icons/dist/20/recent_outline';
import Icon24Linked from '@vkontakte/icons/dist/24/linked';
import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';
import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from 'atoms/Button';
import { isTaskDeleteUpdating } from 'core/selectors/task';
import { isThemeDrak } from 'core/selectors/common';

export const SelectedTaskModal = React.memo<{ id: string }>(({ id }) => {
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();
  const info = useSelector(getSelectedTaskInfo);
  const deletting = useSelector(isTaskDeleteUpdating);
  const dark = useSelector(isThemeDrak);

  const closeModal = React.useCallback(() => {
    dispatch({ type: 'SET_MODAL', payload: null });
  }, [dispatch]);

  const deleteTask = React.useCallback(() => {
    dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.DeleteTask });
  }, [dispatch]);

  return (
    <ModalPage
      id={id}
      onClose={closeModal}
      header={
        <Div>
          <Header
            className={`useMonrope manropeBold ${css({
              '>div>div': { fontSize: '20px !important' },
            } as any)}`}
          >
            {info.name}
          </Header>
        </Div>
      }
    >
      <Div>
        <MiniInfoCell
          before={<Icon20ArticleOutline className={css({ color: dark ? '#AEAEAE' : '#6A6A6A' })} />}
          multiline
          className={css({ padding: '6px 12px 0' })}
        >
          <Text weight="medium" className={`useMonrope ${css({ color: dark ? '#fff' : '#000' })}`}>
            {info.description}
          </Text>
        </MiniInfoCell>
      </Div>
      {info.dueDate !== null && (
        <Div>
          <MiniInfoCell
            before={
              <Icon20RecentOutline className={css({ color: dark ? '#AEAEAE' : '#6A6A6A' })} />
            }
            className={css({ padding: '0 12px' })}
          >
            <Text
              weight="medium"
              className={`useMonrope ${css({ color: dark ? '#fff' : '#000' })}`}
            >
              до {format(new Date(info.dueDate), 'dd MMMM', { locale: ru })}
            </Text>
          </MiniInfoCell>
        </Div>
      )}
      <Div className={css({ padding: '12px 24px', display: 'flex' })}>
        <Button mode="tertiary" disabled={deletting} className={css({ paddingRight: 0 })}>
          <Icon28WriteOutline />
        </Button>
        <Button
          mode="tertiary"
          onClick={deleteTask}
          disabled={deletting}
          className={css({ color: '#FF4848', paddingRight: '0' })}
        >
          {deletting ? <Spinner size="regular" /> : <Icon28DeleteOutlineAndroid />}
        </Button>
      </Div>
    </ModalPage>
  );
});
