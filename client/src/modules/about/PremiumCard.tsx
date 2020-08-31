import React from 'react';
import { Div, CardGrid, Card, Text, MiniInfoCell, Spinner, Subhead } from '@vkontakte/vkui';
import { useFela, CssFelaStyle } from 'react-fela';
import { useSelector, useDispatch } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';
import { Button } from 'atoms/Button';
import { AppDispatchActions, FetchingStateName, premiumPrice } from 'core/models';
import { isPlatformIOS } from 'core/selectors/settings';
import { useTransition, useChain, animated } from 'react-spring';
import {
  hasUserPremium,
  isPaymentUpdating,
  isLastGoogleSyncUpdating,
  getLastGoogleSyncHrs,
} from 'core/selectors/payment';
import Icon24LogoGoogle from '@vkontakte/icons/dist/24/logo_google';
import { getQToQuery } from 'core/selectors/user';
import { ruSyntaxHelper } from 'core/helpers';

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
  {
    id: 6,
    type: 'btn',
  },
];

export const PremiumCard = React.memo(() => {
  const dark = useSelector(isThemeDrak);
  const q = useSelector(getQToQuery);
  const updating = useSelector(isPaymentUpdating);
  const hasPremium = useSelector(hasUserPremium);
  const gUpdating = useSelector(isLastGoogleSyncUpdating);
  const gHrs = useSelector(getLastGoogleSyncHrs);
  const { css } = useFela({ dark });
  const transRef = React.useRef<any>();
  const dispatch = useDispatch<AppDispatchActions>();
  const computedTime = Math.trunc(24 - gHrs);
  const humanTime = computedTime > 1 ? computedTime : 1;

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (gUpdating) {
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
  }, [gUpdating]);

  const handleBuy = React.useCallback(() => {
    dispatch({
      type: 'SET_UPDATING_DATA',
      payload: FetchingStateName.PaymentProccess,
    });
  }, [dispatch]);

  const startSync = React.useCallback(() => {
    dispatch({
      type: 'SET_GOOGLE_SYNC',
      payload: true,
    });
  }, [dispatch]);

  const cellInfoCss = css(infoStyle, textStyle);
  const textCss = css(textStyle);
  const btnCss = css({
    marginTop: '31px',
  });

  const buyButton = hasPremium ? (
    <Button
      mode="primary"
      stretched
      className={btnCss}
      before={
        gUpdating ? (
          <Spinner className={css({ color: dark ? '#222327' : '#fff' })} />
        ) : (
          <Icon24LogoGoogle />
        )
      }
      square
      disabled={gUpdating || gHrs < 24}
      onClick={startSync}
    >
      <a
        href={gUpdating || gHrs < 24 ? undefined : `/google/auth${q}&dark=${dark ? 1 : 0}`}
        target="_blank"
        className={css({ textDecoration: 'none', color: 'inherit' })}
        rel="noopener noreferrer"
      >
        Синхронизировать с Google Tasks
      </a>
    </Button>
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
      Купить {premiumPrice} ₽
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
            {hasPremium ? 'Вы уже купили ' : 'Купите '}
            <span className={css({ color: '#42A4FF' })}>премиум</span>
          </Text>
          {transitionFragments}
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
