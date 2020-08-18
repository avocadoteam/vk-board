import React from 'react';
import { Div, List, Avatar, SimpleCell, Spinner } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import { getMembershipList, isDropMembershipUpdating } from 'core/selectors/membership';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import { useFela } from 'react-fela';
import { isThemeDrak, getMembershipUiState } from 'core/selectors/common';
import { AppDispatchActions, FetchingStateName } from 'core/models';

export const ListMembershipLayout = React.memo(() => {
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();
  const list = useSelector(getMembershipList);
  const dark = useSelector(isThemeDrak);
  const updating = useSelector(isDropMembershipUpdating);
  const { dropUserId } = useSelector(getMembershipUiState);

  const handleDropMembership = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    userId: number
  ) => {
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

  return (
    <Div>
      <List>
        {list.map((m) => (
          <SimpleCell
            key={m.userId}
            before={<Avatar size={40} src={m.avatar} />}
            href={!updating ? `https://vk.com/id${m.userId}` : undefined}
            target="_blank"
            after={
              updating && dropUserId === m.userId ? (
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
              ) : (
                <Icon24Cancel
                  className={css({ color: dark ? '#5F5F5F !important' : '#CFCFCF !important' })}
                  onClick={(e) => handleDropMembership(e, m.userId)}
                />
              )
            }
            disabled={updating}
          >
            {m.name}
          </SimpleCell>
        ))}
      </List>
    </Div>
  );
});
