import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { FormLayout, Input, Spinner, FormStatus, withModalRootContext } from '@vkontakte/vkui';
import Icon20ArticleOutline from '@vkontakte/icons/dist/20/article_outline';
import Icon20RecentOutline from '@vkontakte/icons/dist/20/recent_outline';
import { Button } from 'atoms/Button';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import { getNewTaskValues } from 'core/selectors/board';
import { getNewTaskInfo } from 'core/selectors/task';
import { format, isBefore, addDays } from 'date-fns';
import { isThemeDrak } from 'core/selectors/common';

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
  const { updating, hasError, error } = useSelector(getNewTaskInfo);
  const errorVisible = hasError || wrongDate;
  const errorName = hasError ? error : 'Вы установили неверную дату, исправьте пожалуйста.';

  const before = formValues.dueDate && isBefore(new Date(formValues.dueDate), new Date());

  React.useEffect(() => {
    if (updateModalHeight) {
      updateModalHeight();
    }
  }, [errorVisible, updateModalHeight]);

  React.useEffect(() => {
    if (before && !wrongDate) {
      setWrongDate(true);
    }
    if (!before && wrongDate) {
      setWrongDate(false);
    }
  }, [before, wrongDate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    dispatch({ type: 'UPDATE_NEW_TASK', payload: { name, value } });
  };

  const submitForm = () => {
    if (!formValues.name) {
      setHighlight(true);
    } else {
      dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.NewTask });
    }
  };

  const showError = errorVisible && <FormStatus header={errorName} mode="error" />;

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
          <Input
            type="text"
            placeholder="Введите описание"
            minLength={1}
            maxLength={2048}
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
            name="description"
            onChange={onChange}
            disabled={updating}
            value={formValues.description ?? ''}
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
            placeholder="Выберите срок"
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
