import React from 'react';
import { ModalRoot, ModalPage, Separator, List } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatchActions, ActiveModal } from 'core/models';
import { getActiveModal } from 'core/selectors/common';
import { NewTaskModal } from './NewTaskModal';
import { SelectedTaskModal } from './SelectedTaskModal';
import { useFela } from 'react-fela';
import { NewList } from './NewList';
import { Lists } from './Lists';
import { CellButton } from 'atoms/CellButton';
import Icon16InfoOutline from '@vkontakte/icons/dist/16/info_outline';

export const RootModals = React.memo(() => {
  const activeModal = useSelector(getActiveModal);
  const dispatch = useDispatch<AppDispatchActions>();
  const { css } = useFela();

  const closeModal = React.useCallback(() => {
    dispatch({ type: 'SET_MODAL', payload: null });
  }, [dispatch]);

  return (
    <ModalRoot activeModal={activeModal} onClose={closeModal}>
      <ModalPage
        id={ActiveModal.Lists}
        onClose={closeModal}
        header={<NewList />}
        dynamicContentHeight
      >
        <Lists />
        <Separator wide />
        <List>
          <CellButton>
            <Icon16InfoOutline className={css({ marginRight: '1rem' })} /> Информация
          </CellButton>
        </List>
        <div className={css({ height: '10px' })} />
      </ModalPage>

      <NewTaskModal id={ActiveModal.NewTask} />
      <SelectedTaskModal id={ActiveModal.SelectedTask} />
    </ModalRoot>
  );
});
