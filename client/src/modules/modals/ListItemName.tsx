import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatchActions, FetchingStateName, BoardListItem } from 'core/models';
import { useFela } from 'react-fela';
import Icon28ChevronDownOutline from '@vkontakte/icons/dist/28/chevron_down_outline';
import { CellButton } from 'atoms/CellButton';
import { getBoardUiState, isThemeDrak } from 'core/selectors/common';
import * as sel from 'core/selectors/boardLists';
import { useLongPress } from 'core/hooks';
import { Input, Spinner, usePlatform, OS } from '@vkontakte/vkui';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import { tapticSelected } from 'core/vk-bridge/taptic';

type Props = {
  listItem: BoardListItem & {
    isOwner: boolean;
  };
};

export const ListItemName: React.FC<Props> = ({ listItem }) => {
  const [click, setClicked] = React.useState(false);
  const dark = useSelector(isThemeDrak);
  const selectedBoardListId = useSelector(sel.getSelectedListId);
  const { boardListOpenId, editBoardListName } = useSelector(getBoardUiState);
  const updating = useSelector(sel.isEditListUpdating);
  const created = useSelector(sel.isEditListCreated);
  const dispatch = useDispatch<AppDispatchActions>();
  const { css } = useFela();
  const platform = usePlatform();

  const detections = useLongPress<HTMLButtonElement>(() => {
    if (platform === OS.IOS) {
      tapticSelected();
    }
    dispatch({
      type: 'EDIT_BOARD_LIST_NAME',
      payload: { name: listItem.name },
    });
    setClicked(true);
  });

  const closeModal = React.useCallback(() => {
    dispatch({ type: 'SET_MODAL', payload: null });
  }, [dispatch]);

  const handleClickList = () => {
    if (selectedBoardListId !== listItem.id) {
      dispatch({ type: 'SELECT_BOARD_LIST', payload: { id: listItem.id, data: listItem } });
      dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.Tasks });
      closeModal();
    }
  };

  const toggleDropDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (boardListOpenId === listItem.id) {
      dispatch({ type: 'OPEN_BOARD_LIST', payload: 0 });
    } else {
      dispatch({ type: 'OPEN_BOARD_LIST', payload: listItem.id });
    }
  };

  const handleChangeName = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: 'SET_UPDATING_DATA',
        payload: FetchingStateName.EditBoardList,
      });
      dispatch({
        type: 'EDIT_BOARD_LIST_NAME',
        payload: { name: e.target.value, id: listItem.id },
      });
    },
    [dispatch]
  );

  if (click) {
    return (
      <span className={`useMonrope ${css({ display: 'flex' })}`}>
        <Input
          type="text"
          placeholder="Введите название"
          minLength={1}
          maxLength={512}
          className={css({
            width: '100%',
            height: '50px',
            '>div': {
              border: 'none !important',
              background: 'transparent !important',
            },
            '>input': {
              height: '50px',
              paddingLeft: '23px',
              paddingRight: '23px',
              lineHeight: '20px',
              fontSize: '16px',
            },
          } as any)}
          autoFocus
          onChange={handleChangeName}
          value={editBoardListName}
        />
        {updating && (
          <Spinner
            size="small"
            className={css({ width: 'unset', marginRight: '30px', marginTop: '22px' })}
          />
        )}
        {created && !updating && (
          <Icon24DoneOutline
            className={css({ marginRight: '24px', marginTop: '16px', color: '#42A4FF' })}
          />
        )}
        {!created && !updating && (
          <Icon24Cancel
            onClick={() => setClicked(false)}
            className={css({ marginRight: '24px', marginTop: '16px', color: '#42A4FF' })}
          />
        )}
      </span>
    );
  }

  return (
    <CellButton
      onClick={handleClickList}
      selected={selectedBoardListId === listItem.id}
      {...detections}
    >
      <span
        className={css({
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        })}
      >
        {listItem.name}
      </span>
      <Icon28ChevronDownOutline
        className={css({
          marginLeft: 'auto',
          color: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          transform: boardListOpenId === listItem.id ? 'rotate(180deg)' : undefined,
        })}
        onClick={toggleDropDown}
      />
    </CellButton>
  );
};
