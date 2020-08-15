import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch } from 'react-redux';
import { AppDispatchActions } from 'core/models';
import Icon16Add from '@vkontakte/icons/dist/16/add';
import { CellButton } from 'atoms/CellButton';
import { Input } from '@vkontakte/vkui';

export const NewList = React.memo(() => {
  const [click, setClicked] = React.useState(false);
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();

  if (click) {
    return (
      <Input
        type="text"
        placeholder="Введите название"
        minLength={1}
        maxLength={512}
        className={css({
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
      />
    );
  }

  return (
    <CellButton
      onClick={() => setClicked(true)}
      before={<Icon16Add />}
      className={css({ marginTop: '8px' })}
    >
      Новый список
    </CellButton>
  );
});
