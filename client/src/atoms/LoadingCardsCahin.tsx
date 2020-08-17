import React from 'react';
import { LoadingCard } from './LoadingCard';
import { useTransition, useChain, animated } from 'react-spring';

type Props = {
  cards: number[];
};

export const LoadingCardChain = React.memo<Props>(({ cards }) => {
  const transRef = React.useRef<any>();

  const transition = useTransition(cards, {
    from: {
      transform: 'scale(0)',
    },
    enter: {
      transform: 'scale(1)',
    },
    ref: transRef,
    unique: true,
    trail: 1000 / cards.length,
  });

  useChain([transRef], [0, 0.5]);

  return transition((style, card) => {
    return (
      <animated.div style={style}>
        <LoadingCard height={card} />
      </animated.div>
    );
  });
});
