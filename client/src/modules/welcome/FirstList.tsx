import {
  Div,
  FormLayout,
  Group,
  HorizontalScroll,
  Input,
  PanelHeader,
  Spinner,
  Text,
} from '@vkontakte/vkui';
import { Button } from 'atoms/Button';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { isFirstListUpdating } from 'core/selectors/boardLists';
import { getBoardUiState, isThemeDrak } from 'core/selectors/common';
import { safeTrim } from 'core/utils';
import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useChain, useTransition } from 'react-spring';

const suggestions = ['Важные задачи', 'Работа', 'Цели', 'Дом', 'Игры', 'Спорт'];

export const FirstList = React.memo(() => {
  const { css } = useFela();
  const [highlight, setHighlight] = React.useState(false);
  const dark = useSelector(isThemeDrak);
  const updating = useSelector(isFirstListUpdating);
  const dispatch = useDispatch<AppDispatchActions>();
  const { firstBoardListName } = useSelector(getBoardUiState);
  const transRef = React.useRef<any>();

  React.useEffect(() => {
    if (safeTrim(firstBoardListName) && highlight) {
      setHighlight(false);
    }
  }, [highlight, firstBoardListName]);

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
    const name = safeTrim(firstBoardListName);
    dispatch({
      type: 'SET_FIRST_BOARD_LIST_NAME',
      payload: name,
    });
    if (name) {
      dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.FirstBoardList });
    } else {
      setHighlight(true);
    }
  }, [dispatch, firstBoardListName]);

  return (
    <>
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
                border: highlight ? '1px solid #FF4848 !important' : '1px solid #F0F0F0 !important',
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
            disabled={updating}
            before={updating ? <Spinner /> : null}
          >
            Создать
          </Button>
        </span>
      </Div>
    </>
  );
});

const itemStyle = () => ({
  border: ' 1px solid #F0F0F0',
  borderRadius: '27px',
  height: '42px',
  flexShrink: 0,
  marginRight: '9px',
});
