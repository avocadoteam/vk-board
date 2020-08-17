import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions } from 'core/models';
import { FormLayout, Input } from '@vkontakte/vkui';
import { getNewTaskValues } from 'core/selectors/board';
import { getNewTaskInfo } from 'core/selectors/task';
import { isThemeDrak } from 'core/selectors/common';

export const NewTaskHeader = React.memo(({}) => {
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();
  const formValues = useSelector(getNewTaskValues);
  const dark = useSelector(isThemeDrak);
  const { updating } = useSelector(getNewTaskInfo);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    dispatch({ type: 'UPDATE_NEW_TASK', payload: { name, value } });
  };

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
        disabled={updating}
        value={formValues.name}
      />
    </FormLayout>
  );
});
