import React from 'react';
import { ModalRoot } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatchActions, ActiveModal } from 'core/models';
import { getActiveModal } from 'core/selectors/common';
import { ListsModal } from './ListsModal';

export const RootModals = React.memo(() => {
  const activeModal = useSelector(getActiveModal);
  const dispatch = useDispatch<AppDispatchActions>();

  const closeModal = React.useCallback(() => {
    dispatch({ type: 'SET_MODAL', payload: null });
  }, [dispatch]);

  return (
    <ModalRoot activeModal={activeModal} onClose={closeModal}>
      <ListsModal id={ActiveModal.Lists} />
    </ModalRoot>
  );
});
