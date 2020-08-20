import React from 'react';
import { Div, CardGrid, Card, List, Cell, Text, Spinner, PanelHeader } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import { isBoardUpdating } from 'core/selectors/board';
import { useFela } from 'react-fela';
import { TaskCheckLabel, TaskInfo } from 'modules/task';
import { AppDispatchActions, BoardTaskItem } from 'core/models';
import { isTasksUpdating, getFinishedTasksCount } from 'core/selectors/task';
import { ListMembershipStack } from 'modules/board-list';
import { isThemeDrak } from 'core/selectors/common';
import { useTransition, animated, useChain } from 'react-spring';
import { LoadingCardChain } from 'atoms/LoadingCardsCahin';
import { selectedBoardListInfo, getSelectedListTasks } from 'core/selectors/boardLists';

export const BoardLists = React.memo(() => {
  const [showUpdating, setShow] = React.useState(false);
  const dark = useSelector(isThemeDrak);
  const info = useSelector(selectedBoardListInfo);
  const updatingListOfTasks = useSelector(isTasksUpdating);
  const boardUpdating = useSelector(isBoardUpdating);
  const finishedCount = useSelector(getFinishedTasksCount);
  const showFinished = finishedCount > 0;
  const transRef = React.useRef<any>();
  const tasks = useSelector(getSelectedListTasks);

  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();

  React.useEffect(() => {
    let timer: any = null;
    if (updatingListOfTasks) {
      timer = setTimeout(() => {
        setShow(true);
      }, 1000);
    } else {
      setShow(false);
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [updatingListOfTasks]);

  const selectTask = React.useCallback(
    (task: BoardTaskItem) => {
      dispatch({
        type: 'SELECT_TASK',
        payload: task,
      });
    },
    [dispatch]
  );

  const transition = useTransition(tasks, {
    from: {
      transform: 'scale(0)',
    },
    enter: {
      transform: 'scale(1)',
    },
    ref: transRef,
    unique: true,
    trail: 400 / tasks.length,
  });

  useChain([transRef], [0, 0.6]);

  const taskRender = transition((style, t) => {
    return (
      <animated.div style={style}>
        <CardGrid
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
              backgroundColor: dark ? '#222327' : '#FFF',
              padding: '18px',
              width: 'calc(100% - 36px) !important',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.02)',
              border: `1px solid ${dark ? '#343434' : '#F7F7F7'}`,
            })}
          >
            <div style={{ minHeight: 28 }}>
              <TaskCheckLabel id={t.id} name={t.name} />
              <TaskInfo dueDate={t.dueDate} memberships={t.memberships} />
            </div>
          </Card>
        </CardGrid>
      </animated.div>
    );
  });

  return (
    <>
      <PanelHeader
        separator={false}
        left={<ListMembershipStack />}
        className={css({
          background: dark
            ? undefined
            : 'linear-gradient(180deg, #FFFFFF 12.81%, #FBFBFB 100%) !important',
        })}
      >
        <Text
          weight="semibold"
          className={`useMonrope ${css({
            fontSize: '18px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '24px',
          })}`}
        >
          {info.name} {boardUpdating ? <Spinner size="small" /> : null}
        </Text>
      </PanelHeader>
      <Div
        className={css({
          padding: '12px 18px',
          paddingBottom: 80,
          background: dark
            ? undefined
            : 'linear-gradient(180deg, #FFFFFF 12.81%, #FBFBFB 100%) !important',
          height: 'calc(100vh - 170px)',
        })}
      >
        {!updatingListOfTasks && taskRender}
        {updatingListOfTasks && showUpdating && <LoadingCardChain cards={[112, 40, 70]} />}
        {showFinished && (
          <List>
            <Cell onClick={() => {}} expandable>
              <Text className={`useMonrope ${css({ color: '#959595' })}`} weight="medium">
                Готово{' '}
                <span className={`useMonrope ${css({ color: dark ? '#5F5F5F' : '#CFCFCF' })}`}>
                  {finishedCount}
                </span>
              </Text>
            </Cell>
          </List>
        )}
      </Div>
    </>
  );
});
