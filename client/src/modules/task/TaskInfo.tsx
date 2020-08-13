import React from 'react';
import { useFela } from 'react-fela';
import Icon20ArticleOutline from '@vkontakte/icons/dist/20/article_outline';
import Icon20RecentOutline from '@vkontakte/icons/dist/20/recent_outline';
type Props = {
  dueDate: string | null;
};

export const TaskInfo = React.memo<Props>(({ dueDate }) => {
  const { css } = useFela();
  return (
    <span className={css({ height: '28px', display: 'flex', marginTop: '18px', color: '#6A6A6A' })}>
      <Icon20ArticleOutline className={css({ marginRight: '1rem' })} />
      {dueDate !== null && <Icon20RecentOutline />}
    </span>
  );
});
