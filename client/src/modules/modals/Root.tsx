import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import { List, ModalPage, ModalRoot, Separator } from '@vkontakte/vkui';
import { CellButton } from 'atoms/CellButton';
import { getSearch, goBack, push } from 'connected-react-router';
import { ActiveModal, AppDispatchActions, MainView } from 'core/models';
import { getActiveModalRoute } from 'core/selectors/views';
import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteList } from './DeleteList';
import { DeletePreview } from './DeletePreview';
import { DropMember } from './DropMember';
import { EditTask } from './EditTask';
import { Lists } from './Lists';
import { NewList } from './NewList';
import { NewTask } from './NewTask';
import { NewTaskHeader } from './NewTaskHeader';
import { SelectedTask } from './SelectedTask';
import { SelectedTaskHeader } from './SelectedTaskHeader';

export const RootModals = React.memo<{ goForward: (activePanel: MainView) => void }>(
  ({ goForward }) => {
    const [deletedPreview, setDelete] = React.useState(false);
    const [editable, setEditable] = React.useState(false);
    const [highlight, setHighlight] = React.useState(false);

    const search = useSelector(getSearch);
    const activeModal = useSelector(getActiveModalRoute);
    const dispatch = useDispatch<AppDispatchActions>();
    const { css } = useFela();

    const closeModal = React.useCallback(() => {
      dispatch(goBack() as any);
    }, []);

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
              <Icon28SettingsOutline
                width={20}
                height={20}
                className={css({ marginRight: '1rem' })}
              />
              Настройки
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
          header={
            <SelectedTaskHeader
              editable={editable}
              deletedPreview={deletedPreview}
              setHighlight={setHighlight}
              highlight={highlight}
            />
          }
          dynamicContentHeight
        >
          <SelectedTask
            showTask={!deletedPreview && !editable}
            startEdit={() => setEditable(true)}
            showDelete={() => setDelete(true)}
          />
          <DeletePreview deletedPreview={deletedPreview} cancelDelete={() => setDelete(false)} />
          <EditTask
            editable={editable}
            stopEdit={() => setEditable(false)}
            setHighlight={setHighlight}
          />
        </ModalPage>

        <DropMember id={ActiveModal.DropMembership} />
        <DeleteList id={ActiveModal.DeletList} />
      </ModalRoot>
    );
  }
);
