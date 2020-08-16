import React from 'react';
import { useSelector } from 'react-redux';
import { selectedBoardListInfo } from 'core/selectors/board';
import { UsersStack } from '@vkontakte/vkui';
import { useFela } from 'react-fela';

export const ListMembershipStack = React.memo(() => {
  const { memberships } = useSelector(selectedBoardListInfo);
  const { css } = useFela();

  return memberships?.length > 1 ? (
    <UsersStack
      photos={memberships.map((m) => m.avatar)}
      visibleCount={3}
      size="m"
      className={css({ paddingTop: '12px', paddingRight: 0 })}
      layout="vertical"
    />
  ) : null;
});
