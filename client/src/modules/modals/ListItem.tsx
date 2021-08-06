import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatchActions, MainView, BoardListItem, ActiveModal } from 'core/models';
import { useFela } from 'react-fela';
import { Div, Text, Spinner } from '@vkontakte/vkui';
import { CellButton } from 'atoms/CellButton';
import { getBoardUiState } from 'core/selectors/common';
import Icon28ShareExternalOutline from '@vkontakte/icons/dist/28/share_external_outline';
import Icon28UsersOutline from '@vkontakte/icons/dist/28/users_outline';
import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';
import { push, getSearch } from 'connected-react-router';
import { isDeleteListUpdating } from 'core/selectors/boardLists';
import { vkBridge } from 'core/vk-bridge/instance';
import { getAppId, isPlatformIOS } from 'core/selectors/settings';
import { ListItemName } from './ListItemName';
import { hasUserPremium } from 'core/selectors/payment';
import { isOnlyOneListLeft } from 'core/selectors/board';

type Props = {
  goForward: (activePanel: MainView) => void;
  listItem: BoardListItem & {
    isOwner: boolean;
  };
};

export const ListItem: React.FC<Props> = ({ goForward, listItem }) => {
  const deletting = useSelector(isDeleteListUpdating);
  const onlyOneLeft = useSelector(isOnlyOneListLeft);
  const hasPremium = useSelector(hasUserPremium);
  const search = useSelector(getSearch);
  const appId = useSelector(getAppId);
  const { boardListOpenId } = useSelector(getBoardUiState);
  const dispatch = useDispatch<AppDispatchActions>();
  const { css } = useFela();

  const deleteList = React.useCallback(() => {
    dispatch({ type: 'SET_DELETE_BOARD_LIST_ID', payload: boardListOpenId });
    if (isPlatformIOS()) {
      dispatch({ type: 'SET_MODAL', payload: ActiveModal.DeleteList });
    } else {
      dispatch(push(`/${MainView.Board}/${ActiveModal.DeleteList}${search}`) as any);
    }
  }, [dispatch, boardListOpenId, search]);

  const goToMembership = React.useCallback(() => {
    goForward(MainView.ListMembership);
    if (isPlatformIOS()) {
      dispatch({ type: 'SET_MAIN_VIEW', payload: MainView.ListMembership });
    } else {
      dispatch(push(`/${MainView.ListMembership}${search}`) as any);
    }
  }, [dispatch, goForward, search]);

  const sharePost = React.useCallback(
    (listguid: string) => {
      vkBridge.send('VKWebAppShare', { link: `https://vk.com/app${appId}#${listguid}` });
    },
    [appId]
  );

  const deleteBtn =
    listItem.isOwner && !onlyOneLeft ? (
      <CellButton
        className={css({ paddingLeft: 16, paddingRight: 16, color: '#FF4848 !important' })}
        disabled={deletting}
        onClick={deleteList}
      >
        {deletting ? (
          <Spinner
            size="regular"
            className={css({
              width: 'unset',
              marginRight: '1rem',
              color: '#FF4848 !important',
            })}
          />
        ) : (
          <Icon28DeleteOutlineAndroid className={css(iconStyle)} />
        )}
        Удалить список
      </CellButton>
    ) : null;

  return (
    <span>
      <ListItemName listItem={listItem} />
      {boardListOpenId === listItem.id && (
        <Div
          className={css({
            minHeight: '100px',
            transition: '.2s ease',
            paddingBottom: 0,
            paddingTop: 0,
          })}
        >
          <CellButton
            className={css({ paddingLeft: 16, paddingRight: 16 })}
            onClick={goToMembership}
            disabled={deletting}
          >
            <Icon28UsersOutline className={css(iconStyle)} />
            Доступ
          </CellButton>
          <CellButton
            className={css({ paddingLeft: 16, paddingRight: 16 })}
            disabled={deletting}
            onClick={() => sharePost(listItem.listguid)}
          >
            <Icon28ShareExternalOutline className={css(iconStyle)} />
            Поделиться
          </CellButton>
          <Text
            weight="regular"
            className={`useMonrope ${css({
              fontSize: '12px',
              color: '#959595',
              lineHeight: '20px',
              padding: '0 1rem',
            })}`}
          >
            Список станет доступен другим пользователям с ссылкой{' '}
            {hasPremium ? '' : '(до 3-x человек в бесплатной версии)'}
          </Text>
          {deleteBtn}
        </Div>
      )}
    </span>
  );
};

const iconStyle = () => ({
  marginRight: '1rem',
  width: '20px !important',
  height: '20px !important',
  '>svg': { width: '20px', height: '20px' },
});
