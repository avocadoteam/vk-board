import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions } from 'core/models';
import { Header, Div, FormLayout, Input } from '@vkontakte/vkui';
import { getSelectedTaskInfo, getEditTaskValues } from 'core/selectors/board';
import { isThemeDrak } from 'core/selectors/common';

type Props = {
  editable: boolean;
  deletedPreview: boolean;
};

export const SelectedTaskHeader = React.memo<Props>(({ editable, deletedPreview }) => {
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();
  const info = useSelector(getSelectedTaskInfo);
  const dark = useSelector(isThemeDrak);
  const formValues = useSelector(getEditTaskValues);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    dispatch({ type: 'EDIT_TASK', payload: { name, value } });
  };

  if (!editable) {
    return (
      <Div>
        <Header
          className={`useMonrope manropeBold ${css({
            textAlign: deletedPreview ? 'center' : 'left',
            '>div>div': { fontSize: '20px !important' },
            '>div': {
              display: deletedPreview ? 'block' : undefined,
            },
          } as any)}`}
        >
          {deletedPreview ? 'Вы уверены?' : info.name}
        </Header>
      </Div>
    );
  }

  return (
    <FormLayout className={'useMonrope'}>
      <Input
        type="text"
        placeholder="Введите название"
        minLength={1}
        maxLength={1024}
        className={`${css({
          '>div': {
            border: 'none !important',
            background: 'transparent !important',
          },
          '>input': {
            fontSize: '20px',
            fontWeight: 600,
            '::placeholder': {
              color: dark ? '#5F5F5F' : '#CFCFCF',
            },
          },
        } as any)} `}
        name="name"
        onChange={onChange}
        // disabled={updating}
        value={formValues.name}
      />
    </FormLayout>
  );
});
