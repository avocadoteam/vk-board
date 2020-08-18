import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBoardLists } from 'core/selectors/board';
import { AppDispatchActions, FetchingStateName, MainView } from 'core/models';
import { useFela } from 'react-fela';
import { List, withModalRootContext, Div, Text } from '@vkontakte/vkui';
import Icon28ChevronDownOutline from '@vkontakte/icons/dist/28/chevron_down_outline';
import { CellButton } from 'atoms/CellButton';
import { getBoardUiState, isThemeDrak } from 'core/selectors/common';
import Icon28ShareExternalOutline from '@vkontakte/icons/dist/28/share_external_outline';
import Icon28UsersOutline from '@vkontakte/icons/dist/28/users_outline';
import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';
import { push, getSearch } from 'connected-react-router';

type Props = {
  goForward: (activePanel: MainView) => void;
  updateModalHeight?: () => void;
};

const ListsPC = React.memo<Props>(({ updateModalHeight, goForward }) => {
  const listItems = useSelector(getBoardLists);
  const search = useSelector(getSearch);
  const dark = useSelector(isThemeDrak);
  const { selectedBoardListId, boardListOpenId } = useSelector(getBoardUiState);
  const dispatch = useDispatch<AppDispatchActions>();
  const { css } = useFela();

  React.useEffect(() => {
    if (updateModalHeight) {
      updateModalHeight();
    }
  }, [listItems.length, updateModalHeight, boardListOpenId]);

  const closeModal = React.useCallback(() => {
    dispatch({ type: 'SET_MODAL', payload: null });
  }, [dispatch]);

  const goToMembership = React.useCallback(() => {
    closeModal();
    goForward(MainView.ListMembership);
    dispatch(push(`/${MainView.ListMembership}${search}`) as any);
  }, [dispatch, goForward, closeModal, search]);

  const selectList = React.useCallback(
    (id: number) => {
      dispatch({ type: 'SELECT_BOARD_LIST', payload: id });
      dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.Tasks });
    },
    [dispatch]
  );

  const handleClickList = (id: number) => {
    if (selectedBoardListId !== id) {
      selectList(id);
      closeModal();
    }
  };

  const toggleDropDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, listId: number) => {
    e.stopPropagation();
    if (boardListOpenId === listId) {
      dispatch({ type: 'OPEN_BOARD_LIST', payload: 0 });
    } else {
      dispatch({ type: 'OPEN_BOARD_LIST', payload: listId });
    }
  };

  return (
    <List>
      {listItems.map((i) => (
        <span key={i.id}>
          <CellButton onClick={() => handleClickList(i.id)} selected={selectedBoardListId === i.id}>
            <span
              className={css({
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              })}
            >
              {i.name}
            </span>
            <Icon28ChevronDownOutline
              className={css({
                marginLeft: 'auto',
                color: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                transform: boardListOpenId === i.id ? 'rotate(180deg)' : undefined,
              })}
              onClick={(e) => toggleDropDown(e, i.id)}
            />
          </CellButton>
          {boardListOpenId === i.id && (
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
              >
                <Icon28UsersOutline className={css(iconStyle)} />
                Доступ
              </CellButton>
              <CellButton className={css({ paddingLeft: 16, paddingRight: 16 })}>
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
                Список станет доступен другим пользователям с ссылкой (до 3 человек в бесплатной
                версии)
              </Text>
              <CellButton className={css({ paddingLeft: 16, paddingRight: 16, color: '#FF4848' })}>
                <Icon28DeleteOutlineAndroid className={css(iconStyle)} />
                Удалить список
              </CellButton>
            </Div>
          )}
        </span>
      ))}
    </List>
  );
});

export const Lists = withModalRootContext(ListsPC);

const iconStyle = () => ({
  marginRight: '1rem',
  width: '20px !important',
  height: '20px !important',
  '>svg': { width: '20px', height: '20px' },
});
