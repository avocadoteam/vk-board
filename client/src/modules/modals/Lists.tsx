import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBoardLists, getBoardUiState } from 'core/selectors/board';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { useFela } from 'react-fela';
import { List, withModalRootContext } from '@vkontakte/vkui';
import Icon28ChevronDownOutline from '@vkontakte/icons/dist/28/chevron_down_outline';
import { CellButton } from 'atoms/CellButton';

const ListsPC = React.memo<{ updateModalHeight?: () => void }>(({ updateModalHeight }) => {
  const [openedListId, setOpenListId] = React.useState(0);
  const listItems = useSelector(getBoardLists);
  const selectedBoardListId = useSelector(getBoardUiState).selectedBoardListId;
  const dispatch = useDispatch<AppDispatchActions>();
  const { css } = useFela();

  React.useEffect(() => {
    if (updateModalHeight) {
      updateModalHeight();
    }
  }, [listItems.length, updateModalHeight]);

  const closeModal = React.useCallback(() => {
    dispatch({ type: 'SET_MODAL', payload: null });
  }, [dispatch]);

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
    if (openedListId === listId) {
      setOpenListId(0);
    } else {
      setOpenListId(listId);
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
              className={css({ marginLeft: 'auto', color: 'rgba(0, 0, 0, 0.1)' })}
              onClick={(e) => toggleDropDown(e, i.id)}
            />
          </CellButton>
          {/* <Cell
            className={css({
              height: openedListId === i.id ? '100px' : 0,
              // minHeight: openedListId === i.id ? '100px' : 0,
              transition: '.2s ease',
            })}
          >
            hui
          </Cell> */}
        </span>
      ))}
    </List>
  );
});

export const Lists = withModalRootContext(ListsPC);
