import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { ModalPage, Header, MiniInfoCell, Text, Div, Spinner } from '@vkontakte/vkui';
import { getSelectedTaskInfo } from 'core/selectors/board';
import Icon20ArticleOutline from '@vkontakte/icons/dist/20/article_outline';
import Icon20RecentOutline from '@vkontakte/icons/dist/20/recent_outline';
import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';
import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from 'atoms/Button';
import { isTaskDeleteUpdating } from 'core/selectors/task';
import { isThemeDrak } from 'core/selectors/common';

export const SelectedTaskModal = React.memo<{ id: string }>(({ id }) => {
  const { css } = useFela();
  const [deletedPreview, setPreview] = React.useState(false);
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

  const showTask = !deletedPreview ? (
    <>
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
        <Button
          onClick={() => setPreview(true)}
          disabled={deletting}
          before={deletting ? <Spinner size="regular" /> : <Icon28DeleteOutlineAndroid />}
          mode="destructive"
          size="xl"
        >
          Удалить
        </Button>
        <Button
          mode="tertiary"
          disabled={deletting}
          className={css({ paddingRight: 0, color: dark ? '#959595' : '#AEAEAE' })}
        >
          <Icon28WriteOutline />
        </Button>
      </Div>
    </>
  ) : null;

  const deletePreviewText = deletedPreview ? (
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
          onClick={() => setPreview(false)}
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
  ) : null;

  return (
    <ModalPage
      id={id}
      onClose={closeModal}
      header={
        <Div>
          <Header
            className={`useMonrope manropeBold ${css({
              textAlign: deletedPreview ? 'center' : 'left',
              '>div>div': { fontSize: '20px !important' },
              '>div': {
                display: deletedPreview ? 'block' : undefined,
              },
            } as any)}`}
          >
            {deletedPreview ? 'Вы уверены?' : info.name}
          </Header>
        </Div>
      }
    >
      {showTask}
      {deletePreviewText}
    </ModalPage>
  );
});
