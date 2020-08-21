import React from 'react';
import { View, Panel, PanelHeader, PanelHeaderBack, Text } from '@vkontakte/vkui';
import { Offline } from './Offline';
import { useSelector, useDispatch } from 'react-redux';
import { getActiveMainView } from 'core/selectors/router';
import { MainView, AppDispatchActions, ActiveModal } from 'core/models';
import { BoardLayout } from 'modules/board';
import { RootModals } from 'modules/modals/Root';
import { ListMembershipLayout } from 'modules/board-list';
import { useViewChange } from 'core/hooks';
import { goBack, push, getSearch } from 'connected-react-router';
import { useFela } from 'react-fela';
import { isThemeDrak } from 'core/selectors/common';
import { Premium } from 'modules/about';
import { MembershipPreview } from 'modules/membership-preview';
import { isPreviewMembershipReady } from 'core/selectors/membership';
import { Welcome } from 'modules/welcome';

export const Main = React.memo(() => {
  const activeView = useSelector(getActiveMainView);
  const dispatch = useDispatch<AppDispatchActions>();
  const dark = useSelector(isThemeDrak);
  const search = useSelector(getSearch);
  const previewMembershipReady = useSelector(isPreviewMembershipReady);
  const { css } = useFela();
  const { goForward, goBack: swipeBack, history } = useViewChange(MainView, 'Board', true);

  React.useEffect(() => {
    if (previewMembershipReady) {
      goToMembershipPreview();
    }
  }, [previewMembershipReady]);

  const goToMembershipPreview = React.useCallback(() => {
    goForward(MainView.ListSharePreview);
    dispatch(push(`/${MainView.ListSharePreview}${search}`) as any);
  }, [dispatch, goForward, search]);

  const handleBack = () => {
    if (activeView === MainView.ListMembership) {
      dispatch({ type: 'SET_MODAL', payload: ActiveModal.Lists });
    }
    swipeBack();
    dispatch(goBack() as any);
  };

  return (
    <View
      activePanel={activeView}
      modal={<RootModals goForward={goForward} />}
      onSwipeBack={handleBack}
      history={history}
    >
      <Panel
        id={MainView.Board}
        className={css({
          background: dark
            ? undefined
            : 'linear-gradient(180deg, #FFFFFF 12.81%, #FBFBFB 100%) !important',
          '>div': {
            background: dark
              ? undefined
              : 'linear-gradient(180deg, #FFFFFF 12.81%, #FBFBFB 100%) !important',
          },
        } as any)}
      >
        <BoardLayout />
      </Panel>
      <Panel id={MainView.Offline}>
        <Offline />
      </Panel>
      <Panel id={MainView.ListMembership}>
        <PanelHeader separator={false} left={<PanelHeaderBack onClick={handleBack} />}>
          <Text
            weight="semibold"
            className={`useMonrope ${css({
              fontSize: '18px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '24px',
            })}`}
          >
            Доступ
          </Text>
        </PanelHeader>
        <ListMembershipLayout />
      </Panel>
      <Panel id={MainView.About}>
        <PanelHeader separator={false} left={<PanelHeaderBack onClick={handleBack} />}>
          <Text
            weight="semibold"
            className={`useMonrope ${css({
              fontSize: '18px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '24px',
            })}`}
          >
            О приложении
          </Text>
        </PanelHeader>
        <Premium />
      </Panel>
      <Panel id={MainView.ListSharePreview}>
        <PanelHeader separator={false} />
        <MembershipPreview handleBack={handleBack} />
      </Panel>
      <Panel id={MainView.Welcome}>
        <Welcome />
      </Panel>
    </View>
  );
});
