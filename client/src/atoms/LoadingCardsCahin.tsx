import React from 'react';
import { LoadingCard } from './LoadingCard';

type Props = {
  cards: number[];
};

export const LoadingCardChain = React.memo<Props>(({ cards }) => {
  return (
    <>
      {cards.map((c) => (
        <LoadingCard height={c} key={c} />
      ))}
    </>
  );
});
