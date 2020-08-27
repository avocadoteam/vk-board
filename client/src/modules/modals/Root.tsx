import React from 'react';
import { ModalRoot, ModalPage, Separator, List } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatchActions, ActiveModal, MainView } from 'core/models';
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
import { push, getSearch, goBack } from 'connected-react-router';
import { DropMember } from './DropMember';
import { DeleteList } from './DeleteList';
import { getActiveModalRoute, getActiveMainView } from 'core/selectors/router';

export const RootModals = React.memo<{ goForward: (activePanel: MainView) => void }>(
  ({ goForward }) => {
    const [deletedPreview, setDelete] = React.useState(false);
    const [editable, setEditable] = React.useState(false);
    const [highlight, setHighlight] = React.useState(false);

    const search = useSelector(getSearch);
    const activeModal = useSelector(getActiveModalRoute);
    const mainView = useSelector(getActiveMainView);
    const dispatch = useDispatch<AppDispatchActions>();
    const { css } = useFela();

    const closeModal = React.useCallback(() => {
      if (mainView === MainView.Board || mainView === MainView.ListMembership) {
        dispatch(goBack() as any);
      }
    }, [dispatch, mainView]);

    const goToAbout = React.useCallback(() => {
      goForward(MainView.About);
      dispatch(push(`/${MainView.About}${search}`) as any);
    }, [dispatch, goForward, search]);

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
              <Icon16InfoOutline className={css({ marginRight: '1rem' })} /> Настройки
            </CellButton>
          </List>
          <div className={css({ height: '10px' })} />
        </ModalPage>

        <ModalPage
          id={ActiveModal.NewTask}
          onClose={closeModal}
          header={<NewTaskHeader highlight={highlight} setHighlight={setHighlight} />}
          dynamicContentHeight
        >
          <NewTask setHighlight={setHighlight} />
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
