import React from 'react';
import { Div, List, Avatar, SimpleCell, Spinner } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import { getMembershipList, isDropMembershipUpdating } from 'core/selectors/membership';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import { useFela } from 'react-fela';
import { isThemeDrak, getMembershipUiState } from 'core/selectors/common';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { isListMembershipOpenedByOwner } from 'core/selectors/boardLists';

export const ListMembershipLayout = React.memo(() => {
  const list = useSelector(getMembershipList);
  const updating = useSelector(isDropMembershipUpdating);

  return (
    <Div>
      <List>
        {list.map((m) => (
          <SimpleCell
            key={m.userId}
            before={<Avatar size={40} src={m.avatar} />}
            href={!updating ? `https://vk.com/id${m.userId}` : undefined}
            target="_blank"
            after={<DropMembershipItem updating={updating} userId={m.userId} />}
            disabled={updating}
          >
            {m.name}
          </SimpleCell>
        ))}
      </List>
    </Div>
  );
});

type Props = {
  userId: number;
  updating: boolean;
};

const DropMembershipItem: React.FC<Props> = ({ userId, updating }) => {
  const { dropUserId } = useSelector(getMembershipUiState);
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);
  const canDropMembership = useSelector(isListMembershipOpenedByOwner);
  const dispatch = useDispatch<AppDispatchActions>();

  const handleDropMembership = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    if (updating) {
      return;
    }

    dispatch({
      type: 'DROP_MEMBER_SHIP_ID',
      payload: userId,
    });
    dispatch({
      type: 'SET_UPDATING_DATA',
      payload: FetchingStateName.DropMembership,
    });
  };

  if (!canDropMembership) {
    return null;
  }

  if (updating && dropUserId === userId) {
    return (
      <Spinner
        size="regular"
        className={css({
          '>div': {
            color: dark ? '#5F5F5F !important' : '#CFCFCF !important',
            padding: '0 !important',
          },
          padding: '10px 2px 10px 10px',
        } as any)}
      />
    );
  }

  return (
    <Icon24Cancel
      className={css({ color: dark ? '#5F5F5F !important' : '#CFCFCF !important' })}
      onClick={handleDropMembership}
    />
  );
};
