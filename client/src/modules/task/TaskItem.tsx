import { Card, CardGrid } from '@vkontakte/vkui';
import { getSearch, push } from 'connected-react-router';
import { ActiveModal, AppDispatchActions, BoardTaskItem, MainView } from 'core/models';
import { isThemeDrak } from 'core/selectors/common';
import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import { TaskCheckLabel, TaskInfo } from '.';

export const TaskItem = React.memo<{ task: BoardTaskItem }>(({ task }) => {
  const dark = useSelector(isThemeDrak);
  const search = useSelector(getSearch);
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();
  const [style, animate] = useSpring(() => ({
    transform: 'scale(0)',
  }));

  React.useEffect(() => {
    animate({ transform: 'scale(1)' });

    return () => {
      animate({ cancel: true });
    };
  }, []);

  const selectTask = React.useCallback(() => {
    dispatch({
      type: 'SELECT_TASK',
      payload: task,
    });
    dispatch(push(`/${MainView.Board}/${ActiveModal.SelectedTask}${search}`) as any);
  }, [dispatch, search, task]);
  return (
    <animated.div style={style}>
      <CardGrid
        className={css({
          padding: 0,
          marginBottom: '1rem',
        })}
        onClick={selectTask}
      >
        <Card
          size="l"
          className={css({
            borderRadius: '17px !important',
            backgroundColor: dark ? '#222327' : '#FFF',
            padding: '18px 18px 0',
            width: 'calc(100% - 36px) !important',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.02)',
            border: `1px solid ${dark ? '#343434' : '#F7F7F7'}`,
          })}
        >
          <div style={{ minHeight: 28 }}>
            <TaskCheckLabel task={task} />
            <TaskInfo task={task} />
          </div>
        </Card>
      </CardGrid>
    </animated.div>
  );
});
