import Icon24LogoGoogle from '@vkontakte/icons/dist/24/logo_google';
import { Card, CardGrid, Div, Spinner, Subhead, Text } from '@vkontakte/vkui';
import { Button } from 'atoms/Button';
import { ruSyntaxHelper } from 'core/helpers';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import { isThemeDrak } from 'core/selectors/common';
import {
  getLastGoogleSyncHrs,
  hasUserPremium,
  isLastGoogleSyncUpdating
} from 'core/selectors/payment';
import { isPlatformIOS } from 'core/selectors/settings';
import { getQToQuery } from 'core/selectors/user';
import React from 'react';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';


const PremiumSub = () => {
  const dark = useSelector(isThemeDrak);
  const appearance = dark ? 'dark' : 'light';

  return (
    <iframe
      src={`https://avocadoteam.github.io/app-sub-modal/?appearance=${appearance}&app=stuff`}
      style={{ height: 'calc(75vh)', border: 0 }}
      width="100%"
    />
  );
};

export const PremiumCard = React.memo(() => {
  const dark = useSelector(isThemeDrak);
  const q = useSelector(getQToQuery);
  const hasPremium = useSelector(hasUserPremium);
  const gUpdating = useSelector(isLastGoogleSyncUpdating);
  const gHrs = useSelector(getLastGoogleSyncHrs);
  const gClicked = useSelector((state) => state.ui.googleSyncClicked);
  const gSyncDisabled = gClicked || gUpdating || gHrs < 24;
  const { css } = useFela({ dark });
  const dispatch = useDispatch<AppDispatchActions>();
  const computedTime = Math.trunc(24 - gHrs);
  const humanTime = computedTime > 1 ? computedTime : 1;

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

  const startSync = React.useCallback(() => {
    setTimeout(() => {
      dispatch({
        type: 'SET_GOOGLE_SYNC',
        payload: true,
      });
    }, 200);
  }, [dispatch]);


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
  ) : null;



  if (isPlatformIOS() && !hasPremium) {
    return null;
  }

  return (
    <>
      <PremiumSub />
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
            {hasPremium ? (
              <Text
                weight="semibold"
                className={`useMonrope ${css({
                  fontSize: '18px',
                  lineHeight: '24px',
                })}`}
              >
                {'Вы уже купили '}
                <span className={css({ color: '#42A4FF' })}>премиум</span>
              </Text>
            ) : null}
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
    </>
  );
});
