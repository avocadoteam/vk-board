import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import Icon16Add from '@vkontakte/icons/dist/16/add';
import { CellButton } from 'atoms/CellButton';
import { Input, Spinner, usePlatform, OS, Div, Text } from '@vkontakte/vkui';
import {
  isNewListUpdating,
  isNewListCreated,
  canUserContinueCreateLists,
} from 'core/selectors/boardLists';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';
import { tapticSelected } from 'core/vk-bridge/taptic';
import { isThemeDrak } from 'core/selectors/common';
import Icon16Lock from '@vkontakte/icons/dist/16/lock';

export const NewList = React.memo(() => {
  const [click, setClicked] = React.useState(false);
  const [highlight, setHighlight] = React.useState(false);
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();
  const updating = useSelector(isNewListUpdating);
  const name = useSelector((state) => state.ui.board.boardListName);
  const created = useSelector(isNewListCreated) && !updating;
  const canCreateLists = useSelector(canUserContinueCreateLists);
  const dark = useSelector(isThemeDrak);

  const platform = usePlatform();

  React.useEffect(() => {
    if (name && highlight) {
      setHighlight(false);
    }
  }, [name, highlight]);

  const handleClick = () => {
    if (platform === OS.IOS) {
      tapticSelected();
    }
    setClicked(true);
  };

  const createList = React.useCallback(() => {
    if (!name) {
      setHighlight(true);
    } else {
      dispatch({
        type: 'SET_UPDATING_DATA',
        payload: FetchingStateName.NewBoardList,
      });
    }
  }, [dispatch, name]);

  const handleChangeName = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: 'SET_BOARD_LIST_NAME',
        payload: e.target.value,
      });
    },
    [dispatch]
  );

  if (!canCreateLists) {
    return (
      <Div>
        <Text
          weight="medium"
          className={`useMonrope ${css({
            fontSize: '16px',
            lineHeight: '24px',
            color: dark ? '#AEAEAE' : '#6A6A6A',
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
          })}`}
        >
          <Icon16Lock width={20} height={20} className={css({ marginRight: '1rem' })} />
          Лимит (бесплатная версия)
        </Text>
      </Div>
    );
  }

  if (click) {
    return (
      <span
        className={`useMonrope ${css({
          display: 'flex',
          borderBottom: highlight ? '1px solid #FF4848 !important' : undefined,
          boxSizing: 'border-box',
          transition: '.2s ease',
        })}`}
      >
        <Input
          type="text"
          placeholder="Введите название"
          minLength={1}
          maxLength={64}
          className={css({
            width: '100%',
            marginTop: '8px',
            '>div': {
              border: 'none !important',
              background: 'transparent !important',
            },
            '>input': {
              paddingLeft: '23px',
              paddingRight: '23px',
            },
          } as any)}
          autoFocus
          onChange={handleChangeName}
          value={name}
        />
        {updating && (
          <Spinner
            size="small"
            className={css({ width: 'unset', marginRight: '30px', marginTop: '22px' })}
          />
        )}
        {created && (
          <Icon24DoneOutline
            className={css({ marginRight: '24px', marginTop: '16px', color: '#42A4FF' })}
          />
        )}
        {!updating && !created && (
          <Text
            weight="medium"
            onClick={createList}
            className={css({
              color: '#42A4FF',
              fontSize: '13px',
              alignSelf: 'center',
              marginTop: '8px',
              marginRight: '16px',
            })}
          >
            Создать
          </Text>
        )}
      </span>
    );
  }

  return (
    <CellButton onClick={handleClick} className={css({ marginTop: '6px !important' })}>
      <Icon16Add className={css({ marginRight: '.5rem' })} />
      Новый список
    </CellButton>
  );
});
