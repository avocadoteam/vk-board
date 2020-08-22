import React from 'react';
import { ModalRoot, ModalPage, Separator, List } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatchActions, ActiveModal, MainView } from 'core/models';
import { getActiveModal } from 'core/selectors/common';
import { useFela } from 'react-fela';
import { NewList } from './NewList';
import { Lists } from './Lists';
import { CellButton } from 'atoms/CellButton';
import Icon16InfoOutline from '@vkontakte/icons/dist/16/info_outline';
import { SelectedTaskHeader } from './SelectedTaskHeader';
import { SelectedTask } from './SelectedTask';
import { DeletePreview } from './DeletePreview';
import { EditTask } from './EditTask';
import { NewTaskHeader } from './NewTaskHeader';
import { NewTask } from './NewTask';
import { push, getSearch } from 'connected-react-router';
import { DropMember } from './DropMember';
import { DeleteList } from './DeleteList';

export const RootModals = React.memo<{ goForward: (activePanel: MainView) => void }>(
  ({ goForward }) => {
    const [deletedPreview, setDelete] = React.useState(false);
    const [editable, setEditable] = React.useState(false);
    const search = useSelector(getSearch);
    const activeModal = useSelector(getActiveModal);
    const dispatch = useDispatch<AppDispatchActions>();
    const { css } = useFela();

    const closeModal = React.useCallback(() => {
      dispatch({ type: 'SET_MODAL', payload: null });
    }, [dispatch]);

    const goToAbout = React.useCallback(() => {
      closeModal();
      goForward(MainView.About);
      dispatch(push(`/${MainView.About}${search}`) as any);
    }, [dispatch, goForward, closeModal, search]);

    return (
      <ModalRoot activeModal={activeModal} onClose={closeModal}>
        <ModalPage
          id={ActiveModal.Lists}
          onClose={closeModal}
          header={<NewList />}
          dynamicContentHeight
          settlingHeight={100}
        >
          <Lists goForward={goForward} />
          <Separator wide />
          <List>
            <CellButton onClick={goToAbout}>
              <Icon16InfoOutline className={css({ marginRight: '1rem' })} /> Информация
            </CellButton>
          </List>
          <div className={css({ height: '10px' })} />
        </ModalPage>

        <ModalPage
          id={ActiveModal.NewTask}
          onClose={closeModal}
          header={<NewTaskHeader />}
          dynamicContentHeight
        >
          <NewTask />
        </ModalPage>

        <ModalPage
          id={ActiveModal.SelectedTask}
          onClose={closeModal}
          header={<SelectedTaskHeader editable={editable} deletedPreview={deletedPreview} />}
          dynamicContentHeight
        >
          <SelectedTask
            showTask={!deletedPreview && !editable}
            startEdit={() => setEditable(true)}
            showDelete={() => setDelete(true)}
          />
          <DeletePreview deletedPreview={deletedPreview} cancelDelete={() => setDelete(false)} />
          <EditTask editable={editable} stopEdit={() => setEditable(false)} />
        </ModalPage>

        <DropMember id={ActiveModal.DropMembership} />
        <DeleteList id={ActiveModal.DeletList} />
      </ModalRoot>
    );
  }
);
