import React from 'react';
import {
  Group,
  Div,
  Text,
  Spinner,
  View,
  Panel,
  PanelHeader,
  Input,
  FormLayout,
  HorizontalScroll,
} from '@vkontakte/vkui';
import { useFela } from 'react-fela';
import { useSelector, useDispatch } from 'react-redux';
import { isThemeDrak, getBoardUiState } from 'core/selectors/common';
import { Button } from 'atoms/Button';
import { AppDispatchActions, FetchingStateName, WelcomeView, MainView } from 'core/models';
import { KanbanBoard } from 'assets/svg/KanbanBoard';
import { useViewChange } from 'core/hooks';
import { useTransition, useChain, animated } from 'react-spring';
import { isFirstListUpdating } from 'core/selectors/boardLists';
import { getWelcomeView } from 'core/selectors/router';
import { getSearch, goBack, push } from 'connected-react-router';

const suggestions = ['Важные задачи', 'Работа', 'Цели', 'Дом', 'Игры', 'Спорт'];

export const Welcome = React.memo(() => {
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);
  const updating = useSelector(isFirstListUpdating);
  const dispatch = useDispatch<AppDispatchActions>();
  const { firstBoardListName } = useSelector(getBoardUiState);
  const { goForward, goBack: swipeBack, history } = useViewChange(WelcomeView, 'Greetings', true);
  const activeView = useSelector(getWelcomeView);
  const transRef = React.useRef<any>();
  const search = useSelector(getSearch);

  const nextView = React.useCallback(() => {
    goForward(WelcomeView.TaskCreation);
    dispatch(push(`/${MainView.Welcome}/${WelcomeView.TaskCreation}${search}`) as any);
  }, [dispatch, search, goForward]);

  const back = React.useCallback(() => {
    swipeBack();
    dispatch(goBack() as any);
  }, [dispatch, search]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: 'SET_FIRST_BOARD_LIST_NAME',
        payload: e.target.value,
      });
    },
    [dispatch]
  );
  const handleSet = React.useCallback(
    (payload: string) => {
      dispatch({
        type: 'SET_FIRST_BOARD_LIST_NAME',
        payload,
      });
    },
    [dispatch]
  );

  const transition = useTransition(suggestions, {
    from: {
      transform: 'scale(0)',
    },
    enter: {
      transform: 'scale(1)',
    },
    ref: transRef,
    unique: true,
    trail: 4000 / suggestions.length,
  });

  useChain([transRef], [0, 0.6]);
  const suggestionRender = transition((style, t) => {
    return (
      <animated.div style={style} className={css(itemStyle)} onClick={() => handleSet(t)}>
        <Text
          weight="medium"
          className={`useMonrope ${css({
            fontSize: '13px',
            lineHeight: '22px',
            padding: '10px 20px',
          })}`}
        >
          {t}
        </Text>
      </animated.div>
    );
  });

  const create = React.useCallback(() => {
    dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.FirstBoardList });
  }, [dispatch]);

  return (
    <View activePanel={activeView} onSwipeBack={back} history={history}>
      <Panel id={WelcomeView.Greetings}>
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
      </Panel>
      <Panel id={WelcomeView.TaskCreation}>
        <PanelHeader separator={false} />
        <Group separator="hide" className={css({ height: '20vh' })} />
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
            Создайте свой первый список
          </Text>
          <Text
            weight="medium"
            className={`useMonrope ${css({
              fontSize: '15px',
              lineHeight: '22px',
              textAlign: 'center',
              padding: '0 25px',
              color: dark ? '#858585' : '#6A6A6A',
            })}`}
          >
            Название можно изменить в настройках списка.
          </Text>
          <FormLayout className={css({ margin: '0 13px' })}>
            <Input
              type="text"
              placeholder="Придумайте название"
              minLength={1}
              maxLength={64}
              className={css({
                marginTop: '2rem',
                marginBottom: '1rem',
                '>div': {
                  border: 'none !important',
                  background: 'transparent !important',
                  borderRadius: '11px !important',
                },
                '>input': {
                  border: '1px solid #F0F0F0 !important',
                  background: 'transparent !important',
                  borderRadius: '11px !important',
                  height: '59px !important',
                  paddingLeft: '19px',
                  paddingRight: '19px',
                },
              } as any)}
              onChange={handleChange}
              value={firstBoardListName}
            />
          </FormLayout>
          <span className={css({ display: 'flex', alignItems: 'center' })}>
            <Text
              weight="medium"
              className={`useMonrope ${css({
                fontSize: '13px',
                lineHeight: '22px',
                color: dark ? '#858585' : '#AEAEAE',
                paddingLeft: '25px',
              })}`}
            >
              Подсказки:
            </Text>
            <HorizontalScroll className={css({ paddingLeft: '9px' })}>
              <div style={{ display: 'flex' }}>{suggestionRender}</div>
            </HorizontalScroll>
          </span>
          <span
            className={css({
              padding: '0 25px',
              display: 'flex',
              marginBottom: '.5rem',
              marginTop: '1rem',
            })}
          >
            <Button
              mode="primary"
              stretched
              square
              onClick={create}
              disabled={!firstBoardListName || updating}
              before={updating ? <Spinner /> : null}
            >
              Создать
            </Button>
          </span>
        </Div>
      </Panel>
    </View>
  );
});

const itemStyle = () => ({
  border: ' 1px solid #F0F0F0',
  borderRadius: '27px',
  height: '42px',
  flexShrink: 0,
  marginRight: '9px',
});
