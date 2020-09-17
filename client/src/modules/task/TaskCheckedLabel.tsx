import React from 'react';
import './styleCbx.css';
import { useFela } from 'react-fela';
import { useDispatch } from 'react-redux';
import { AppDispatchActions } from 'core/models';

type Props = {
  id: string;
  name: string;
};

export const TaskCheckedLabel = React.memo<Props>(({ id, name }) => {
  const { css } = useFela();
  const uniqId = `${id}-${name}`;
  const dispatch = useDispatch<AppDispatchActions>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      dispatch({
        type: 'UNFINISH_TASK',
        payload: id,
      });
    } else {
      dispatch({
        type: 'REMOVE_UNFINISH_TASK',
        payload: id,
      });
    }
  };

  return (
    <span className={css({ height: '28px' })} onClick={(e) => e.stopPropagation()}>
      <input
        id={uniqId}
        className="inp-cbx"
        type="checkbox"
        style={{ display: 'none' }}
        onChange={handleChange}
        defaultChecked
      />
      <label htmlFor={uniqId} className="cbx">
        <span>
          <svg width="12px" height="9px" viewBox="0 0 12 9">
            <polyline points="1 5 4 8 11 1" />
          </svg>
        </span>
        <div
          className={`useMonrope ${css({ fontSize: '15px', fontWeight: 500, overflow: 'hidden' })}`}
        >
          {name}
        </div>
      </label>
    </span>
  );
});
