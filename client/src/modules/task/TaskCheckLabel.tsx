import React from 'react';
import './styleCbx.css';
import { useFela } from 'react-fela';

type Props = {
  id: number;
  name: string;
};

export const TaskCheckLabel = React.memo<Props>(({ id, name }) => {
  const { css } = useFela();
  const uniqId = `${id}-${name}`;

  return (
    <span className={css({ height: '28px' })}>
      <input id={uniqId} className="inp-cbx" type="checkbox" style={{ display: 'none' }} />
      <label htmlFor={uniqId} className="cbx">
        <span>
          <svg width="12px" height="9px" viewBox="0 0 12 9">
            <polyline points="1 5 4 8 11 1" />
          </svg>
        </span>
        <div className={`useMonrope ${css({ fontSize: '15px', fontWeight: 500 })}`}>{name}</div>
      </label>
    </span>
  );
});
