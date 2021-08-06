import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import { List, ModalPage, ModalRoot, Separator } from '@vkontakte/vkui';
import { CellButton } from 'atoms/CellButton';
import { getSearch, goBack, push } from 'connected-react-router';
import { ActiveModal, AppDispatchActions, MainView } from 'core/models';
import { getActiveMainView, getActiveModalRoute } from 'core/selectors/views';
import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteList } from './DeleteList';
import { DropMember } from './DropMember';
import { EditTask } from './EditTask';
import { Lists } from './Lists';
import { NewList } from './NewList';
import { NewTask } from './NewTask';
import { NewTaskHeader } from './NewTaskHeader';
import { SelectedTask } from './SelectedTask';
import { SelectedTaskHeader } from './SelectedTaskHeader';
import { DeleteTask } from './DeleteTask';
import { EditTaskHeader } from './EditTaskHeader';
import { isPlatformIOS } from 'core/selectors/settings';

export const RootModals = React.memo<{ goForward: (activePanel: MainView) => void }>(
  ({ goForward }) => {
    const [highlight, setHighlight] = React.useState(false);

    const mainView = useSelector(getActiveMainView);
    const search = useSelector(getSearch);
    const activeModal = useSelector(getActiveModalRoute);
    const dispatch = useDispatch<AppDispatchActions>();
    const { css } = useFela();

    const closeModal = React.useCallback(() => {
      if (mainView === MainView.Board || mainView === MainView.ListMembership) {
        if (isPlatformIOS()) {
          dispatch({ type: 'SET_MODAL', payload: null });
        } else {
          dispatch(goBack() as any);
        }
      }
    }, [dispatch, mainView]);

    const goToAbout = React.useCallback(() => {
      goForward(MainView.About);
      if (isPlatformIOS()) {
        dispatch({ type: 'SET_MAIN_VIEW', payload: MainView.About });
      } else {
        dispatch(push(`/${MainView.About}${search}`) as any);
      }
    }, [dispatch, goForward, search]);

    if (activeModal === null) {
      return null;
    }

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
          header={<SelectedTaskHeader />}
          dynamicContentHeight
        >
          <SelectedTask />
        </ModalPage>
        <ModalPage
          id={ActiveModal.EditTask}
          onClose={closeModal}
          header={<EditTaskHeader setHighlight={setHighlight} highlight={highlight} />}
          dynamicContentHeight
        >
          <EditTask setHighlight={setHighlight} />
        </ModalPage>

        <DropMember id={ActiveModal.DropMembership} />
        <DeleteList id={ActiveModal.DeleteList} />
        <DeleteTask id={ActiveModal.DeleteTask} />
      </ModalRoot>
    );
  }
);
