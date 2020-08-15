import React from 'react';
import { Div, Header, Group, CardGrid, Card, List, Cell, Text } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import { selectedBoardListInfo, getFinishedTasksCount } from 'core/selectors/board';
import { useFela } from 'react-fela';
import { TaskCheckLabel, TaskInfo } from 'modules/task';
import { AppDispatchActions, BoardTaskItem } from 'core/models';

export const BoardLists = React.memo(() => {
  const info = useSelector(selectedBoardListInfo);
  const finishedCount = useSelector(getFinishedTasksCount);
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
    <Div className={css({ padding: '12px 18px', paddingBottom: 80 })}>
      <Group separator="hide">
        <Header
          className={`${css({
            padding: 0,
            marginBottom: '1rem',
            '>div>div': { paddingBottom: '0 !important' },
          } as any)} useMonrope manropeBold`}
        >
          {info.name}
        </Header>
        {info.tasks?.map((t) => (
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
                backgroundColor: '#FBFBFB',
                padding: '18px',
                width: 'calc(100% - 36px) !important',
              })}
            >
              <div style={{ minHeight: 28 }}>
                <TaskCheckLabel id={t.id} name={t.name} />
                <TaskInfo dueDate={t.dueDate} memberships={t.memberships} />
              </div>
            </Card>
          </CardGrid>
        ))}
      </Group>
      {finishedCount > 0 && (
        <Group>
          <List>
            <Cell onClick={() => {}} expandable>
              <Text className={`useMonrope ${css({ color: '#959595' })}`} weight="medium">
                Выполненные {finishedCount}
              </Text>
            </Cell>
          </List>
        </Group>
      )}
    </Div>
  );
});
