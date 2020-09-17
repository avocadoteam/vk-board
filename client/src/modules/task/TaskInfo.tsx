import Icon20ArticleOutline from '@vkontakte/icons/dist/20/article_outline';
import Icon20RecentOutline from '@vkontakte/icons/dist/20/recent_outline';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import { Text } from '@vkontakte/vkui';
import { BoardTaskItem } from 'core/models';
import { isThemeDrak } from 'core/selectors/common';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { useFela } from 'react-fela';
import { useSelector } from 'react-redux';

type Props = {
  task: BoardTaskItem;
};

export const TaskInfo = React.memo<Props>(({ task: { dueDate, description, notification } }) => {
  const dark = useSelector(isThemeDrak);
  const { css } = useFela();
  return (
    <span
      className={css({
        display: 'flex',
        marginTop: '18px',
        color: dark ? '#AEAEAE' : '#6A6A6A',
      })}
    >
      {description && <Icon20ArticleOutline className={css(iconStyle)} />}
      {notification && dueDate && <Icon28Notifications className={css(iconStyle)} />}
      <TimeInfo dueDate={dueDate} />
    </span>
  );
});

const iconStyle = () => ({
  marginBottom: '18px',
  alignSelf: 'center',
  marginRight: '1rem',
  width: '22px !important',
  height: '22px !important',
  '>svg': { width: '22px', height: '22px' },
});

const TimeInfo = React.memo<Pick<Props['task'], 'dueDate'>>(({ dueDate }) => {
  const { css } = useFela();
  if (dueDate === null) {
    return null;
  }

  return (
    <>
      <Icon20RecentOutline className={css(iconStyle)} />
      <Text
        weight="semibold"
        className={`useMonrope ${css({
          fontSize: '13px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          alignSelf: 'center',
          marginBottom: '18px',
        })}`}
      >
        {format(new Date(dueDate), 'dd MMMM', { locale: ru })}
      </Text>
    </>
  );
});
