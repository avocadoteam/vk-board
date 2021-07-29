import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';
import Icon24LogoGoogle from '@vkontakte/icons/dist/24/logo_google';
import { Card, CardGrid, Div, MiniInfoCell, Spinner, Subhead, Text } from '@vkontakte/vkui';
import { Button } from 'atoms/Button';
import { ruSyntaxHelper } from 'core/helpers';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { isThemeDrak } from 'core/selectors/common';
import {
  getLastGoogleSyncHrs,
  hasUserPremium,
  isLastGoogleSyncUpdating,
  isPaymentUpdating,
} from 'core/selectors/payment';
import { isPlatformIOS } from 'core/selectors/settings';
import { getQToQuery, isAdmin } from 'core/selectors/user';
import { vkBridge } from 'core/vk-bridge/instance';
import React from 'react';
import { CssFelaStyle, useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useChain, useTransition } from 'react-spring';

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
    text: 'Никакой рекламы',
    type: 'info',
  },
];

export const PremiumCard = React.memo(() => {
  const dark = useSelector(isThemeDrak);
  const q = useSelector(getQToQuery);
  const updating = useSelector(isPaymentUpdating);
  const hasPremium = useSelector(hasUserPremium);
  const gUpdating = useSelector(isLastGoogleSyncUpdating);
  const gHrs = useSelector(getLastGoogleSyncHrs);
  const gClicked = useSelector((state) => state.ui.googleSyncClicked);
  const gSyncDisabled = gClicked || gUpdating || gHrs < 24;
  const { css } = useFela({ dark });
  const transRef = React.useRef<any>();
  const dispatch = useDispatch<AppDispatchActions>();
  const computedTime = Math.trunc(24 - gHrs);
  const humanTime = computedTime > 1 ? computedTime : 1;
  const admin = useSelector(isAdmin);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (gClicked) {
      timeout = setTimeout(() => {
        dispatch({
          type: 'SET_UPDATING_DATA',
          payload: FetchingStateName.LastGoogleSync,
        });
      }, 2500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [gClicked]);

  const handleBuy = React.useCallback(() => {
    vkBridge.send('VKWebAppShowOrderBox', { type: 'item', item: 'KUPIT_PREMIUM' });
  }, [admin]);

  const startSync = React.useCallback(() => {
    setTimeout(() => {
      dispatch({
        type: 'SET_GOOGLE_SYNC',
        payload: true,
      });
    }, 200);
  }, [dispatch]);

  const cellInfoCss = css(infoStyle, textStyle);
  const textCss = css(textStyle);
  const btnCss = css({
    marginTop: '31px',
  });

  const buyButton = hasPremium ? (
    <a
      href={gSyncDisabled ? undefined : `/gt/auth${q}&dark=${dark ? 1 : 0}`}
      target="_blank"
      className={css({
        textDecoration: 'none',
        color: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        marginTop: '31px',
      })}
      rel="noopener noreferrer"
      onClick={startSync}
    >
      <Button
        mode="primary"
        stretched
        before={
          gUpdating ? (
            <Spinner className={css({ color: dark ? '#222327' : '#fff' })} />
          ) : (
            <Icon24LogoGoogle />
          )
        }
        square
        disabled={gSyncDisabled}
      >
        Синхронизировать с Google Tasks
      </Button>
    </a>
  ) : (
    <Button
      mode="primary"
      stretched
      className={btnCss}
      square
      onClick={handleBuy}
      disabled={updating}
      before={updating ? <Spinner className={css({ color: dark ? '#222327' : '#fff' })} /> : null}
    >
      Купить
    </Button>
  );

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
        <MiniInfoCell
          before={<Icon24DoneOutline className={textCss} />}
          multiline
          className={cellInfoCss}
        >
          <Text weight="medium" className={`useMonrope ${textCss}`}>
            {item.text}
          </Text>
        </MiniInfoCell>
      </animated.div>
    );
  });

  if (isPlatformIOS() && !hasPremium) {
    return null;
  }

  return (
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
          width: 'calc(100% - 48px) !important',
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
            {hasPremium ? 'Вы уже купили ' : 'Купите '}
            <span className={css({ color: '#42A4FF' })}>премиум</span>
          </Text>
          {transitionFragments}
          {buyButton}
          {hasPremium && gHrs < 24 && (
            <Div>
              <Subhead
                weight="regular"
                className={css({ color: 'var(--text_secondary)', margin: 0 })}
              >
                Вы сможете синхронизировать google tasks снова только через{' '}
                {`${humanTime} ${
                  ruSyntaxHelper(humanTime) === 'single'
                    ? 'час'
                    : ruSyntaxHelper(humanTime) === 'singlePlural'
                    ? 'часа'
                    : 'часов'
                }`}
              </Subhead>
            </Div>
          )}
        </div>
      </Card>
    </CardGrid>
  );
});

const infoStyle: CssFelaStyle<{}, {}> = () => ({
  padding: '0',
  marginTop: '20px',
});
const textStyle: CssFelaStyle<{}, { dark: boolean }> = ({ dark }) => ({
  color: dark ? '#FFF !important' : '#000 !important',
});
