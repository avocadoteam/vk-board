import React from 'react';
import { Div, CardGrid, Card, Text, MiniInfoCell } from '@vkontakte/vkui';
import { useFela, CssFelaStyle } from 'react-fela';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';
import { Button } from 'atoms/Button';
import { appV } from 'core/models';
import { Notifications } from './Notifications';
import { isPlatformIOS } from 'core/selectors/settings';
import Icon16Lock from '@vkontakte/icons/dist/16/lock';
import { useTransition, useChain, animated } from 'react-spring';

const itemsToAppear = [
  {
    id: 1,
    text: 'Синхронизация с Google Tasks',
    type: 'info',
  },
  {
    id: 2,
    text: 'Неограниченные списки',
    type: 'info',
  },
  {
    id: 3,
    text: 'Неограниченные пользователи',
    type: 'info',
  },
  {
    id: 4,
    text: 'Приоритеты задач',
    type: 'info',
  },
  {
    id: 5,
    type: 'btn',
  },
];

export const Premium = React.memo(() => {
  const dark = useSelector(isThemeDrak);
  const { css } = useFela({ dark });

  const cellInfoCss = css(infoStyle, textStyle);
  const textCss = css(textStyle);
  const btnCss = css({
    marginTop: '31px',
  });

  const buyButton = isPlatformIOS() ? (
    <Button mode="primary" stretched className={btnCss} disabled before={<Icon16Lock />} square>
      Недоступно на iOS
    </Button>
  ) : (
    <Button mode="primary" stretched className={btnCss} square>
      Купить 228 ₽
    </Button>
  );

  const transRef = React.useRef<any>();

  const transition = useTransition(itemsToAppear, {
    from: {
      transform: 'scale(0)',
    },
    enter: {
      transform: 'scale(1)',
    },
    ref: transRef,
    unique: true,
    trail: 4000 / itemsToAppear.length,
  });

  useChain([transRef], [0, 0.6]);

  const transitionFragments = transition((style, item) => {
    return (
      <animated.div style={style}>
        {item.type === 'info' ? (
          <MiniInfoCell
            before={<Icon24DoneOutline className={textCss} />}
            multiline
            className={cellInfoCss}
          >
            <Text weight="medium" className={`useMonrope ${textCss}`}>
              {item.text}
            </Text>
          </MiniInfoCell>
        ) : (
          buyButton
        )}
      </animated.div>
    );
  });

  return (
    <Div>
      <CardGrid
        className={css({
          padding: 0,
          marginBottom: '1rem',
        })}
      >
        <Card
          size="l"
          className={css({
            borderRadius: '21px !important',
            backgroundColor: dark ? 'rgba(95, 95, 95, 0.03)' : 'rgba(66, 164, 255, 0.03)',
            padding: '24px 23px',
            width: 'calc(100% - 36px) !important',
          })}
        >
          <div
            style={{
              minHeight: 50,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Text
              weight="semibold"
              className={`useMonrope ${css({
                fontSize: '18px',
                lineHeight: '24px',
              })}`}
            >
              Купите <span className={css({ color: '#42A4FF' })}>премиум</span>
            </Text>
            {transitionFragments}
          </div>
        </Card>
      </CardGrid>
      <Notifications />
      <Text
        weight="medium"
        className={`useMonrope ${css(textStyle, {
          fontSize: '12px',
          lineHeight: '16px',
          color: dark ? '#5F5F5F' : '#CFCFCF',
          marginTop: '25px',
          textAlign: 'center',
        })}`}
      >
        Версия {appV}, avocado
      </Text>
    </Div>
  );
});

const infoStyle: CssFelaStyle<{}, {}> = () => ({
  padding: '0',
  marginTop: '20px',
});
const textStyle: CssFelaStyle<{}, { dark: boolean }> = ({ dark }) => ({
  color: dark ? '#FFF !important' : '#000 !important',
});
