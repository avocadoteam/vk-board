import Icon20ArticleOutline from '@vkontakte/icons/dist/20/article_outline';
import Icon20RecentOutline from '@vkontakte/icons/dist/20/recent_outline';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import {
  FormLayout,
  FormStatus,
  Input,
  Spinner,
  Textarea,
  withModalRootContext,
} from '@vkontakte/vkui';
import { Button } from 'atoms/Button';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { getNewTaskValues } from 'core/selectors/board';
import { isThemeDrak } from 'core/selectors/common';
import { getNewTaskInfo } from 'core/selectors/task';
import { safeTrim } from 'core/utils';
import { addDays, format, isBefore } from 'date-fns';
import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { NewTaskNotification } from './NewTaskNotification';

const nextDay = format(addDays(new Date(), 1), 'yyyy-MM-dd');

type Props = {
  updateModalHeight?: () => void;
  setHighlight: (p: boolean) => void;
};

const NewTaskPC = React.memo<Props>(({ updateModalHeight, setHighlight }) => {
  const { css } = useFela();
  const [wrongDate, setWrongDate] = React.useState(false);
  const dispatch = useDispatch<AppDispatchActions>();
  const formValues = useSelector(getNewTaskValues);
  const dark = useSelector(isThemeDrak);
  const { updating } = useSelector(getNewTaskInfo);
  const errorName = 'Вы установили неверную дату, исправьте, пожалуйста.';

  const before = formValues.dueDate && isBefore(new Date(formValues.dueDate), new Date());

  React.useEffect(() => {
    if (updateModalHeight) {
      updateModalHeight();
    }
  }, [wrongDate, updateModalHeight]);

  React.useEffect(() => {
    if (before && !wrongDate) {
      setWrongDate(true);
    }
    if (!before && wrongDate) {
      setWrongDate(false);
    }
  }, [before, wrongDate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    if (name === 'description' && value.length > 1024) {
      return;
    }
    dispatch({ type: 'UPDATE_NEW_TASK', payload: { name, value } });
  };

  const submitForm = () => {
    const trimName = safeTrim(formValues.name);
    dispatch({
      type: 'UPDATE_NEW_TASK',
      payload: { name: 'name', value: trimName },
    });
    if (!trimName) {
      setHighlight(true);
    } else if (!wrongDate) {
      dispatch({
        type: 'UPDATE_NEW_TASK',
        payload: { name: 'description', value: safeTrim(formValues.description ?? '') },
      });

      dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.NewTask });
    }
  };

  const showError = wrongDate && <FormStatus header={errorName} mode="error" />;

  return (
    <>
      <FormLayout className={'useMonrope'}>
        {showError}
        <span className={css({ display: 'flex' })}>
          <Icon20ArticleOutline
            className={css({
              marginLeft: '22px',
              marginTop: '12px',
              color: dark ? '#5F5F5F' : '#CFCFCF',
            })}
          />
          <Textarea
            placeholder="Введите описание"
            minLength={1}
            maxLength={1024}
            className={css({
              marginLeft: '0 !important',
              width: '100%',
              '>div': {
                border: 'none !important',
                background: 'transparent !important',
              },
              '>.Textarea__el': {
                '::placeholder': {
                  color: dark ? '#5F5F5F' : '#CFCFCF',
                },
                minHeight: '52px !important',
                maxHeight: 'unset !important',
              },
            } as any)}
            name="description"
            onChange={onChange}
            disabled={updating}
            value={formValues.description ?? ''}
            grow
            onResize={updateModalHeight}
          />
        </span>
        <span className={css({ display: 'flex' })}>
          <Icon20RecentOutline
            className={css({
              marginLeft: '22px',
              marginTop: '12px',
              color: dark ? '#5F5F5F' : '#CFCFCF',
            })}
          />
          <Input
            type="date"
            placeholder={!formValues.dueDate ? 'Выберите срок' : undefined}
            className={css({
              marginLeft: '0 !important',
              width: '100%',
              '>div': {
                border: 'none !important',
                background: 'transparent !important',
              },
              '>input': {
                '::placeholder': {
                  color: dark ? '#5F5F5F' : '#CFCFCF',
                },
              },
            } as any)}
            name="dueDate"
            onChange={onChange}
            disabled={updating}
            min={nextDay}
            value={formValues.dueDate ?? ''}
          />
        </span>

        <NewTaskNotification updateModalHeight={updateModalHeight!} />

        <Button
          mode="primary"
          size="xl"
          stretched
          before={updating ? <Spinner /> : <Icon24Add />}
          disabled={updating}
          onClick={submitForm}
        >
          Создать задачу
        </Button>
      </FormLayout>
      <div className={css({ height: '10px' })} />
    </>
  );
});

export const NewTask = withModalRootContext(NewTaskPC);
