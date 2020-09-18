import { Div, PanelHeader, Spinner, Text } from '@vkontakte/vkui';
import { LoadingCardChain } from 'atoms/LoadingCardsCahin';
import { isBoardUpdating } from 'core/selectors/board';
import { getSelectedListTasks, selectedBoardListInfo } from 'core/selectors/boardLists';
import { isTasksUpdating } from 'core/selectors/task';
import { AdsBanner } from 'modules/ads';
import { ListMembershipStack } from 'modules/board-list';
import { TaskItem } from 'modules/task/TaskItem';
import { TasksRefresher } from 'modules/task/TasksRefresher';
import React from 'react';
import { useFela } from 'react-fela';
import { useSelector } from 'react-redux';
import { BoardEmpty } from './BoardEmpty';
import { BoardFinishedTasks } from './BoardFinishedTasks';

export const BoardLists = React.memo(() => {
  const [showUpdating, setShow] = React.useState(false);
  const info = useSelector(selectedBoardListInfo);
  const tasks = useSelector(getSelectedListTasks);
  const updatingListOfTasks = useSelector(isTasksUpdating);
  const boardUpdating = useSelector(isBoardUpdating);

  const { css } = useFela();

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

  return (
    <>
      <PanelHeader separator={false} left={<ListMembershipStack />}>
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
      <TasksRefresher>
        <Div
          className={css({
            padding: '12px 18px',
            paddingBottom: 90,
          })}
        >
          <AdsBanner />
          <BoardEmpty />
          {updatingListOfTasks && showUpdating
            ? null
            : tasks.map((t) => <TaskItem task={t} key={t.id} />)}
          {updatingListOfTasks && showUpdating ? <LoadingCardChain cards={[60, 30, 60]} /> : null}
          <BoardFinishedTasks />
        </Div>
      </TasksRefresher>
    </>
  );
});
