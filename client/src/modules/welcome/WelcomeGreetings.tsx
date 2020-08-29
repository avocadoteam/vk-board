import { Div, Group, PanelHeader, Text } from '@vkontakte/vkui';
import { KanbanBoard } from 'assets/svg/KanbanBoard';
import { Button } from 'atoms/Button';
import { getSearch, push } from 'connected-react-router';
import { AppDispatchActions, WelcomeView, MainView } from 'core/models';
import { isThemeDrak } from 'core/selectors/common';
import { getLocationMainPath } from 'core/selectors/router';
import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';

export const WelcomeGreetings = React.memo<{ goForward: (v: WelcomeView) => void }>(
  ({ goForward }) => {
    const { css } = useFela();
    const dark = useSelector(isThemeDrak);
    const dispatch = useDispatch<AppDispatchActions>();
    const mainView = useSelector(getLocationMainPath) || MainView.Board;
    const search = useSelector(getSearch);

    const nextView = React.useCallback(() => {
      goForward(WelcomeView.TaskCreation);
      dispatch(push(`/${mainView}/${WelcomeView.TaskCreation}${search}`) as any);
    }, [dispatch, search, goForward, mainView]);

    return (
      <>
        <PanelHeader separator={false} />
        <Group separator="hide" className={css({ height: '40vh' })}>
          <Div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            })}
          >
            <KanbanBoard
              className={css({
                display: 'flex',
                marginTop: 'auto',
                marginBottom: '32px',
                alignSelf: 'center',
              })}
            />
          </Div>
        </Group>
        <Div>
          <Text
            weight="semibold"
            className={`useMonrope ${css({
              fontSize: '20px',
              lineHeight: '25px',
              textAlign: 'center',
              padding: '0 44px',
              marginBottom: '14px',
            })}`}
          >
            Добро пожаловать!
          </Text>
          <Text
            weight="medium"
            className={`useMonrope ${css({
              fontSize: '15px',
              lineHeight: '22px',
              textAlign: 'center',
              padding: '0 25px',
              marginBottom: '30px',
              color: dark ? '#858585' : '#6A6A6A',
            })}`}
          >
            Stuff — мини-приложение для отслеживания своих задач.
          </Text>
          <span className={css({ padding: '0 25px', display: 'flex', marginBottom: '.5rem' })}>
            <Button mode="primary" stretched size="xl" onClick={nextView}>
              Продолжить
            </Button>
          </span>
        </Div>
      </>
    );
  }
);
