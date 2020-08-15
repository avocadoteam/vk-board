import React from 'react';
import { Div, CardGrid, Card, List, Cell, Text, Spinner, PanelHeader } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectedBoardListInfo,
  getFinishedTasksCount,
  isTasksUpdating,
  isBoardUpdating,
} from 'core/selectors/board';
import { useFela } from 'react-fela';
import { TaskCheckLabel, TaskInfo } from 'modules/task';
import { AppDispatchActions, BoardTaskItem } from 'core/models';
import { LoadingCard } from 'atoms/LoadingCard';

export const BoardLists = React.memo(() => {
  const info = useSelector(selectedBoardListInfo);
  const updatingListOfTasks = useSelector(isTasksUpdating);
  const boardUpdating = useSelector(isBoardUpdating);
  const finishedCount = useSelector(getFinishedTasksCount);
  const showFinished = finishedCount > 0 && !updatingListOfTasks;

  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();

  const selectTask = React.useCallback(
    (task: BoardTaskItem) => {
      dispatch({
        type: 'SELECT_TASK',
        payload: task,
      });
    },
    [dispatch]
  );

  return (
    <>
      <PanelHeader separator={false}>
        <Text weight="semibold" className={`useMonrope ${css({ fontSize: '18px' })}`}>
          {info.name} {boardUpdating ? <Spinner size="small" /> : null}
        </Text>
      </PanelHeader>
      <Div className={css({ padding: '12px 18px', paddingBottom: 80 })}>
        {!updatingListOfTasks &&
          info.tasks?.map((t) => (
            <CardGrid
              key={t.id}
              className={css({
                padding: 0,
                marginBottom: '1rem',
              })}
              onClick={() => selectTask(t)}
            >
              <Card
                size="l"
                className={css({
                  borderRadius: '17px !important',
                  backgroundColor: '#FFF',
                  padding: '18px',
                  width: 'calc(100% - 36px) !important',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.02)',
                  border: '1px solid #F7F7F7',
                })}
              >
                <div style={{ minHeight: 28 }}>
                  <TaskCheckLabel id={t.id} name={t.name} />
                  <TaskInfo dueDate={t.dueDate} memberships={t.memberships} />
                </div>
              </Card>
            </CardGrid>
          ))}
        {updatingListOfTasks && (
          <>
            <LoadingCard height={50} />
            <LoadingCard />
            <LoadingCard height={70} />
          </>
        )}
        {showFinished && (
          <List>
            <Cell onClick={() => {}} expandable>
              <Text className={`useMonrope ${css({ color: '#959595' })}`} weight="medium">
                Выполненные {finishedCount}
              </Text>
            </Cell>
          </List>
        )}
      </Div>
    </>
  );
});
