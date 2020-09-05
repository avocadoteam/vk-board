import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24List from '@vkontakte/icons/dist/24/list';
import { Div, FixedLayout, Group, Separator } from '@vkontakte/vkui';
import { Button } from 'atoms/Button';
import { getSearch, push } from 'connected-react-router';
import { ActiveModal, AppDispatchActions, MainView } from 'core/models';
import { isBoardUpdating } from 'core/selectors/board';
import { getSelectedListId } from 'core/selectors/boardLists';
import { getBoardUiState } from 'core/selectors/common';
import { getActiveMainView } from 'core/selectors/views';
import { ListProgress } from 'modules/board-list';
import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { fromEvent } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

export const BoardActions = React.memo(() => {
  const { css } = useFela();
  const { tasksToBeFinished } = useSelector(getBoardUiState);
  const [scrolling, setScrolling] = React.useState(false);
  const mainView = useSelector(getActiveMainView);
  const selectedBoardListId = useSelector(getSelectedListId);
  const boardUpadting = useSelector(isBoardUpdating);
  const dispatch = useDispatch<AppDispatchActions>();
  const search = useSelector(getSearch);

  React.useEffect(() => {
    const sub = fromEvent(document, 'scroll')
      .pipe(
        tap(() => {
          if (mainView !== MainView.Board) {
            return;
          }
          setScrolling(true);
        })
      )
      .pipe(
        debounceTime(200),
        tap(() => setScrolling(false))
      )
      .subscribe();

    return () => sub.unsubscribe();
  }, [mainView]);

  const openListsModal = React.useCallback(() => {
    dispatch(push(`/${MainView.Board}/${ActiveModal.Lists}${search}`) as any);
  }, [dispatch, search]);

  const openNewTaskModal = React.useCallback(() => {
    dispatch(push(`/${MainView.Board}/${ActiveModal.NewTask}${search}`) as any);
  }, [dispatch, search]);

  return (
    <FixedLayout vertical="bottom" filled>
      {tasksToBeFinished.length ? <ListProgress /> : null}
      <Separator wide />
      <Div>
        <Group>
          <span className={css({ display: 'flex' })}>
            <Button
              mode="primary"
              size="xl"
              stretched
              before={<Icon24Add />}
              onClick={openNewTaskModal}
              disabled={boardUpadting || !selectedBoardListId || scrolling}
            >
              Новая задача
            </Button>
            <Button mode="tertiary" onClick={openListsModal} disabled={boardUpadting || scrolling}>
              <Icon24List />
            </Button>
          </span>
        </Group>
      </Div>
    </FixedLayout>
  );
});
