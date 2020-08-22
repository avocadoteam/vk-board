import React from 'react';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import { getFinishedTasksCount } from 'core/selectors/task';
import { useFela } from 'react-fela';
import { List, Cell, Text } from '@vkontakte/vkui';
import Icon28ChevronDownOutline from '@vkontakte/icons/dist/28/chevron_down_outline';
import { getFinishedListTasks } from 'core/selectors/boardLists';
import { TaskCheckedLabel } from 'modules/task';

export const BoardFinishedTasks = React.memo(() => {
  const [showFinishedList, setShow] = React.useState(false);
  const dark = useSelector(isThemeDrak);
  const tasks = useSelector(getFinishedListTasks);
  const finishedCount = useSelector(getFinishedTasksCount);
  const showFinished = finishedCount > 0;

  const { css } = useFela();

  if (!showFinished) {
    return null;
  }

  const itemsFragments = tasks.map((t) => {
    return (
      <div key={t.id} className={css({ padding: '8px' })}>
        <TaskCheckedLabel id={t.id} name={t.name} />
      </div>
    );
  });

  return (
    <List>
      <Cell onClick={() => setShow((v) => !v)}>
        <span className={css({ display: 'flex', alignItems: 'center' })}>
          <Text className={`useMonrope ${css({ color: '#959595' })}`} weight="medium">
            Готово{' '}
            <span className={`useMonrope ${css({ color: dark ? '#5F5F5F' : '#CFCFCF' })}`}>
              {finishedCount}
            </span>
          </Text>
          <Icon28ChevronDownOutline
            className={css({
              marginLeft: 'auto',
              color: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              transform: showFinishedList ? 'rotate(180deg)' : undefined,
            })}
          />
        </span>
      </Cell>
      {showFinishedList && itemsFragments}
    </List>
  );
});
