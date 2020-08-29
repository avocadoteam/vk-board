import React from 'react';
import { View, Panel, PanelHeader, PanelHeaderBack, Text } from '@vkontakte/vkui';
import { Offline } from './Offline';
import { useSelector, useDispatch } from 'react-redux';
import { getActiveMainView } from 'core/selectors/router';
import { MainView, AppDispatchActions } from 'core/models';
import { BoardLayout } from 'modules/board';
import { RootModals } from 'modules/modals/Root';
import { ListMembershipLayout } from 'modules/board-list';
import { useViewChange } from 'core/hooks';
import { goBack } from 'connected-react-router';
import { useFela } from 'react-fela';
import { isThemeDrak } from 'core/selectors/common';
import { About } from 'modules/about';
import { MembershipPreview } from 'modules/membership-preview';
import { Welcome } from 'modules/welcome';
import { SnakbarsErr } from 'modules/snaks';

export const Main = React.memo(() => {
  const activeView = useSelector(getActiveMainView);
  const dispatch = useDispatch<AppDispatchActions>();
  const dark = useSelector(isThemeDrak);
  const { css } = useFela();
  const { goForward, goBack: swipeBack, history } = useViewChange(MainView, 'Board', true);

  const handleBack = React.useCallback(() => {
    swipeBack();
    dispatch(goBack() as any);
  }, [swipeBack, dispatch]);

  return (
    <>
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
              Настройки
            </Text>
          </PanelHeader>
          <About />
        </Panel>
        <Panel id={MainView.ListSharePreview}>
          <PanelHeader separator={false} />
          <MembershipPreview />
        </Panel>
        <Panel id={MainView.Welcome}>
          <Welcome />
        </Panel>
      </View>
      <SnakbarsErr />
    </>
  );
});
