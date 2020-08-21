import React from 'react';
import { PromoBanner, CardGrid, Card } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import { getAdsData } from 'core/selectors/ads';
import { AppDispatchActions } from 'core/models';
import { useFela } from 'react-fela';
import { isThemeDrak, isAdsShown } from 'core/selectors/common';

export const AdsBanner = React.memo(() => {
  const { css } = useFela();
  const adsData = useSelector(getAdsData);
  const adsBanner = useSelector(isAdsShown);
  const dark = useSelector(isThemeDrak);
  const dispatch = useDispatch<AppDispatchActions>();

  const hideAds = React.useCallback(() => {
    dispatch({ type: 'SET_ADS', payload: false });
  }, [dispatch]);

  if (!adsData || !adsBanner) {
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
          borderRadius: '17px !important',
          padding: '0',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.02)',
          border: `1px solid ${dark ? '#343434' : '#F7F7F7'}`,
          overflow: 'hidden',
        })}
      >
        <div style={{ minHeight: 28 }}>
          <PromoBanner
            className={css({ outline: 'none' })}
            onClose={hideAds}
            bannerData={adsData}
          />
        </div>
      </Card>
    </CardGrid>
  );
});
