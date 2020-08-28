import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions } from 'core/models';
import { Header, Div, FormLayout, Input } from '@vkontakte/vkui';
import { getEditTaskValues } from 'core/selectors/board';
import { isThemeDrak } from 'core/selectors/common';
import { getSelectedTaskInfo, getEditTaskInfo } from 'core/selectors/task';
import { safeTrim } from 'core/utils';

type Props = {
  editable: boolean;
  deletedPreview: boolean;
  setHighlight: (p: boolean) => void;
  highlight: boolean;
};

export const SelectedTaskHeader = React.memo<Props>(
  ({ editable, deletedPreview, highlight, setHighlight }) => {
    const { css } = useFela();
    const dispatch = useDispatch<AppDispatchActions>();
    const info = useSelector(getSelectedTaskInfo);
    const dark = useSelector(isThemeDrak);
    const formValues = useSelector(getEditTaskValues);
    const { updating } = useSelector(getEditTaskInfo);

    React.useEffect(() => {
      if (safeTrim(formValues.name) && highlight) {
        setHighlight(false);
      }
    }, [formValues.name, highlight]);

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
          maxLength={256}
          className={`${css({
            borderBottom: highlight ? '1px solid #FF4848 !important' : undefined,
            boxSizing: 'border-box',
            transition: '.2s ease',
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
  }
);
