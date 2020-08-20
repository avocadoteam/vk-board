import React from 'react';
import { useFela } from 'react-fela';
import Icon20ArticleOutline from '@vkontakte/icons/dist/20/article_outline';
import Icon20RecentOutline from '@vkontakte/icons/dist/20/recent_outline';
import { MembershipItem } from 'core/models';
import { UsersStack, Text } from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';

type Props = {
  dueDate: string | null;
  memberships: MembershipItem[];
};

export const TaskInfo = React.memo<Props>(({ dueDate, memberships = [] }) => {
  const dark = useSelector(isThemeDrak);
  const { css } = useFela();
  return (
    <span
      className={css({
        height: '32px',
        display: 'flex',
        marginTop: '18px',
        color: dark ? '#AEAEAE' : '#6A6A6A',
      })}
    >
      <Icon20ArticleOutline className={css(iconStyle)} />
      <TimeInfo dueDate={dueDate} />
      {memberships?.length > 1 ? (
        <UsersStack
          photos={memberships.map((m) => m.avatar)}
          visibleCount={4}
          size="m"
          className={css({ padding: 0 })}
          layout="vertical"
        />
      ) : null}
    </span>
  );
});

const iconStyle = () => ({
  alignSelf: 'center',
  marginRight: '1rem',
  width: '22px !important',
  height: '22px !important',
  '>svg': { width: '22px', height: '22px' },
});

const TimeInfo = React.memo<Pick<Props, 'dueDate'>>(({ dueDate }) => {
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
        })}`}
      >
        {format(new Date(dueDate), 'dd MMMM', { locale: ru })}
      </Text>
    </>
  );
});
