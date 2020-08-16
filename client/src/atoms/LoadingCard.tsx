import React from 'react';
import { useFela } from 'react-fela';
import { CardGrid, Card } from '@vkontakte/vkui';
import { IStyle } from 'fela';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';

type Props = {
  height?: number;
};

export const LoadingCard = React.memo<Props>(({ height = 112 }) => {
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);

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
            backgroundColor: dark ? 'transparent' : '#FBFBFB',
            padding: '18px',
            width: 'calc(100% - 36px) !important',
          },
          shimmerAnimation
        )}
      >
        <div style={{ height }} />
      </Card>
    </CardGrid>
  );
});

const shimmerAnimation = (): IStyle => ({
  backgroundImage: 'linear-gradient(to right, #FBFBFB 0%, #edeef1 20%, #FBFBFB 40%, #FBFBFB 100%)',
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
