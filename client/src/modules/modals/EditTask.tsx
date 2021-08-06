import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { ActiveModal, AppDispatchActions, FetchingStateName } from 'core/models';
import {
  FormLayout,
  Input,
  withModalRootContext,
  Div,
  FormStatus,
  Spinner,
  Textarea,
} from '@vkontakte/vkui';
import { getEditTaskValues } from 'core/selectors/board';
import Icon20ArticleOutline from '@vkontakte/icons/dist/20/article_outline';
import Icon20RecentOutline from '@vkontakte/icons/dist/20/recent_outline';
import { Button } from 'atoms/Button';
import { isThemeDrak } from 'core/selectors/common';
import { format, isBefore, addDays } from 'date-fns';
import { getEditTaskInfo } from 'core/selectors/task';
import { safeTrim } from 'core/utils';
import { goBack } from 'connected-react-router';
import { isAdmin } from 'core/selectors/user';
import { isPlatformIOS } from 'core/selectors/settings';

const nextDay = format(addDays(new Date(), 1), 'yyyy-MM-dd');

type Props = {
  updateModalHeight?: () => void;
  setHighlight: (p: boolean) => void;
};

const EditTaskPC = React.memo<Props>(({ updateModalHeight, setHighlight }) => {
  const { css } = useFela();
  const [wrongDate, setWrongDate] = React.useState(false);
  const dispatch = useDispatch<AppDispatchActions>();
  const dark = useSelector(isThemeDrak);
  const formValues = useSelector(getEditTaskValues);
  const { updating, notSameData } = useSelector(getEditTaskInfo);
  const admin = useSelector(isAdmin);
  const disabledSubmit = updating || !notSameData;
  const errorName = 'Вы установили неверную дату, исправьте, пожалуйста.';

  const before = formValues.dueDate && isBefore(new Date(formValues.dueDate), new Date());

  React.useEffect(() => {
    if (updateModalHeight) {
      updateModalHeight();
    }
  }, [wrongDate, updateModalHeight, formValues]);

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
    dispatch({ type: 'EDIT_TASK', payload: { name, value } });
  };

  const submitForm = () => {
    const trimName = safeTrim(formValues.name);
    dispatch({
      type: 'EDIT_TASK',
      payload: { name: 'name', value: trimName },
    });
    if (!trimName) {
      setHighlight(true);
    } else if (!wrongDate) {
      dispatch({
        type: 'EDIT_TASK',
        payload: { name: 'description', value: safeTrim(formValues.description ?? '') },
      });

      dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.EditTask });
    }
  };

  const back = React.useCallback(() => {
    if (isPlatformIOS()) {
      dispatch({ type: 'SET_MODAL', payload: ActiveModal.SelectedTask });
    } else {
      dispatch(goBack() as any);
    }
  }, [dispatch]);

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
                maxHeight: 'unset !important',
              },
            } as any)}
            name="description"
            onChange={onChange}
            disabled={updating}
            value={formValues.description ?? ''}
            grow
            onResize={updateModalHeight}
            onFocus={updateModalHeight}
            onBlur={updateModalHeight}
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
            type={admin ? 'datetime-local' : 'date'}
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
            value={formValues.dueDate ? format(new Date(formValues.dueDate), 'yyyy-MM-dd') : ''}
          />
        </span>
      </FormLayout>
      <Div className={css({ display: 'flex' })}>
        <Button
          mode="secondary"
          stretched
          size="xl"
          disabled={updating}
          onClick={back}
          className={css({ marginRight: '10px' })}
        >
          Отмена
        </Button>

        <Button
          mode="primary"
          stretched
          size="xl"
          before={updating ? <Spinner /> : null}
          disabled={disabledSubmit}
          onClick={submitForm}
        >
          Сохранить
        </Button>
      </Div>
    </>
  );
});

export const EditTask = withModalRootContext(EditTaskPC);
