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
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();
  const updating = useSelector(isNewListUpdating);
  const created = useSelector(isNewListCreated) && !updating;
  const canCreateLists = useSelector(canUserContinueCreateLists);
  const dark = useSelector(isThemeDrak);

  const platform = usePlatform();

  const handleClick = () => {
    if (platform === OS.IOS) {
      tapticSelected();
    }
    setClicked(true);
  };

  const handleChangeName = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: 'SET_UPDATING_DATA',
        payload: FetchingStateName.NewBoardList,
      });
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
      <span className={`useMonrope ${css({ display: 'flex' })}`}>
        <Input
          type="text"
          placeholder="Введите название"
          minLength={1}
          maxLength={512}
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
