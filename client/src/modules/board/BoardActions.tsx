import React from 'react';
import { Div, Group, Separator, FixedLayout } from '@vkontakte/vkui';
import Icon24List from '@vkontakte/icons/dist/24/list';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import { useFela } from 'react-fela';
import { Button } from 'atoms/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions, ActiveModal, MainView } from 'core/models';
import { isBoardUpdating } from 'core/selectors/board';
import { ListProgress } from 'modules/board-list';
import { getBoardUiState } from 'core/selectors/common';
import { getSelectedListId } from 'core/selectors/boardLists';
import { push, getSearch } from 'connected-react-router';

export const BoardActions = React.memo(() => {
  const { css } = useFela();
  const { tasksToBeFinished } = useSelector(getBoardUiState);
  const selectedBoardListId = useSelector(getSelectedListId);
  const boardUpadting = useSelector(isBoardUpdating);
  const dispatch = useDispatch<AppDispatchActions>();
  const search = useSelector(getSearch);

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
              disabled={boardUpadting || !selectedBoardListId}
            >
              Новая задача
            </Button>
            <Button mode="tertiary" onClick={openListsModal} disabled={boardUpadting}>
              <Icon24List />
            </Button>
          </span>
        </Group>
      </Div>
    </FixedLayout>
  );
});
