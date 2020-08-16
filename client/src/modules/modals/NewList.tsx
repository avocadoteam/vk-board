import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import Icon16Add from '@vkontakte/icons/dist/16/add';
import { CellButton } from 'atoms/CellButton';
import { Input, Spinner } from '@vkontakte/vkui';
import { isNewListUpdating, isNewListCreated } from 'core/selectors/boardLists';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';

export const NewList = React.memo(() => {
  const [click, setClicked] = React.useState(false);
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();
  const updating = useSelector(isNewListUpdating);
  const created = useSelector(isNewListCreated) && !updating;

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
    <CellButton onClick={() => setClicked(true)} className={css({ marginTop: '6px !important' })}>
      <Icon16Add className={css({ marginRight: '.5rem' })} />
      Новый список
    </CellButton>
  );
});
