import React from 'react';
import { useFela, CssFelaStyle } from 'react-fela';
import { CardGrid, Card } from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';

type Props = {
  height?: number;
};

export const LoadingCard = React.memo<Props>(({ height = 112 }) => {
  const dark = useSelector(isThemeDrak);
  const { css } = useFela({ dark });

  return (
    <CardGrid
      className={css({
        padding: 0,
        marginBottom: '1rem',
      })}
    >
      <Card
        size="l"
        className={css(
          {
            borderRadius: '17px !important',
            backgroundColor: dark ? 'transparent' : '#FAFAFA',
            padding: '18px',
            width: 'calc(100% - 36px) !important',
          },
          shimmerAnimation
        )}
      >
        <div style={{ height }}>
          <span className={css({ display: 'flex', alignItems: 'center' })}>
            <div className={css(styleIcon)} />
            <div className={css(styleText)} />
          </span>
          {height > 50 ? (
            <span className={css({ display: 'flex', alignItems: 'center', marginTop: '1rem' })}>
              <div className={css(styleIconSmall)} />
              <div className={css(styleIconSmall)} />
            </span>
          ) : null}
        </div>
      </Card>
    </CardGrid>
  );
});

const styleIcon: CssFelaStyle<{}, { dark: boolean }> = () => ({
  width: '24.66px',
  height: '25.46px',
  backgroundColor: '#F0F0F0',
  borderRadius: '31.8252px',
  marginRight: '10px',
});

const styleIconSmall: CssFelaStyle<{}, { dark: boolean }> = () => ({
  width: '15px',
  height: '15px',
  backgroundColor: '#F0F0F0',
  borderRadius: '12px',
  marginRight: '6px',
});
const styleText: CssFelaStyle<{}, { dark: boolean }> = () => ({
  width: '119.27px',
  height: '16.02px',
  backgroundColor: '#F0F0F0',
  borderRadius: '7.12088px',
});

const shimmerAnimation: CssFelaStyle<{}, { dark: boolean }> = ({ dark }) => ({
  backgroundImage: dark
    ? 'linear-gradient(to right, #AEAEAE 0%, #edeef1 20%, #AEAEAE 40%, #AEAEAE 100%)'
    : 'linear-gradient(to right, #FAFAFA 0%, #edeef1 20%, #FAFAFA 40%, #FAFAFA 100%)',
  backgroundRepeat: 'no-repeat',

  animationDuration: '1s',
  animationFillMode: 'forwards',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
  animationName: ({
    '0%': {
      backgroundPosition: '-468px 0',
    },

    '100%': {
      backgroundPosition: '468px 0',
    },
  } as unknown) as string,
});
