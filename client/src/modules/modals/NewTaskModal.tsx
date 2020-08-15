import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { ModalPage, FormLayout, Input, Spinner, FormStatus } from '@vkontakte/vkui';
import Icon20ArticleOutline from '@vkontakte/icons/dist/20/article_outline';
import Icon20RecentOutline from '@vkontakte/icons/dist/20/recent_outline';
import { Button } from 'atoms/Button';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import { getNewTaskValues, getNewTaskInfo } from 'core/selectors/board';

export const NewTaskModal = React.memo<{ id: string }>(({ id }) => {
  const { css } = useFela();
  const dispatch = useDispatch<AppDispatchActions>();
  const formValues = useSelector(getNewTaskValues);
  const { updating, hasError, error } = useSelector(getNewTaskInfo);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    dispatch({ type: 'UPDATE_NEW_TASK', payload: { name, value } });
  };

  const closeModal = React.useCallback(() => {
    dispatch({ type: 'SET_MODAL', payload: null });
  }, [dispatch]);

  const submitForm = React.useCallback(() => {
    dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.NewTask });
  }, [dispatch]);

  const showError = hasError && <FormStatus header={error} mode="error" />;

  return (
    <ModalPage
      id={id}
      onClose={closeModal}
      header={
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
              },
            } as any)} `}
            name="name"
            onChange={onChange}
            disabled={updating}
          />
        </FormLayout>
      }
    >
      <FormLayout className={'useMonrope'}>
        {showError}
        <span className={css({ display: 'flex' })}>
          <Icon20ArticleOutline
            className={css({ marginLeft: '22px', marginTop: '12px', color: '#818c99' })}
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
            } as any)}
            name="description"
            onChange={onChange}
            status={formValues.description ? 'valid' : 'error'}
            disabled={updating}
          />
        </span>
        <span className={css({ display: 'flex' })}>
          <Icon20RecentOutline
            className={css({ marginLeft: '22px', marginTop: '12px', color: '#818c99' })}
          />
          <Input
            type="date"
            placeholder="Введите срок"
            className={css({
              marginLeft: '0 !important',
              width: '100%',
              '>div': {
                border: 'none !important',
                background: 'transparent !important',
              },
            } as any)}
            name="dueDate"
            onChange={onChange}
            disabled={updating}
          />
        </span>

        <Button
          mode="primary"
          size="xl"
          stretched
          before={updating ? <Spinner /> : <Icon24Add />}
          disabled={!formValues.name || !formValues.description || updating}
          onClick={submitForm}
        >
          Создать задачу
        </Button>
      </FormLayout>
      <div className={css({ height: '10px' })} />
    </ModalPage>
  );
});
