import React from 'react';
import { Div, List, Avatar, SimpleCell, Spinner, Group, Text } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import { getMembershipList, isDropMembershipUpdating } from 'core/selectors/membership';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import { useFela } from 'react-fela';
import { isThemeDrak, getMembershipUiState } from 'core/selectors/common';
import { AppDispatchActions, ActiveModal, MainView } from 'core/models';
import { isListMembershipOpenedByOwner } from 'core/selectors/boardLists';
import { NoMembers } from 'assets/svg/NoMembers';
import { getSearch, push } from 'connected-react-router';

export const ListMembershipLayout = React.memo(() => {
  const list = useSelector(getMembershipList);
  const updating = useSelector(isDropMembershipUpdating);
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);

  if (!list.length) {
    return (
      <>
        <Group separator="hide" className={css({ height: '40vh' })}>
          <Div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            })}
          >
            <NoMembers
              className={css({
                display: 'flex',
                marginTop: 'auto',
                marginBottom: '30px',
                alignSelf: 'center',
              })}
            />
          </Div>
        </Group>
        <Div>
          <Text
            weight="semibold"
            className={`useMonrope ${css({
              fontSize: '20px',
              lineHeight: '25px',
              textAlign: 'center',
              padding: '0 44px',
              marginBottom: '14px',
            })}`}
          >
            Тут пусто
          </Text>
          <Text
            weight="medium"
            className={`useMonrope ${css({
              fontSize: '15px',
              lineHeight: '22px',
              textAlign: 'center',
              padding: '0 25px',
              marginBottom: '33px',
              color: dark ? '#858585' : '#6A6A6A',
            })}`}
          >
            На этом экране появятся люди, у которых есть доступ к Вашему списку.
          </Text>
        </Div>
      </>
    );
  }

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
            rel="noopener noreferrer"
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
  const search = useSelector(getSearch);

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
    dispatch(push(`/${MainView.ListMembership}/${ActiveModal.DropMembership}${search}`) as any);
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
