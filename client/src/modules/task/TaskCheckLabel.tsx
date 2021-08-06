import React from 'react';
import './styleCbx.css';
import { useFela } from 'react-fela';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchActions, BoardTaskItem, MainView, ActiveModal } from 'core/models';
import { getSearch, push } from 'connected-react-router';
import { isPlatformIOS } from 'core/selectors/settings';

type Props = {
  task: BoardTaskItem;
};

export const TaskCheckLabel = React.memo<Props>(({ task }) => {
  const { css } = useFela();
  const uniqId = `${task.id}-${task.name}`;
  const dispatch = useDispatch<AppDispatchActions>();
  const search = useSelector(getSearch);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch({
        type: 'FINISH_TASK',
        payload: task.id,
      });
    } else {
      dispatch({
        type: 'REMOVE_FINISH_TASK',
        payload: task.id,
      });
    }
  };

  const selectTask = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    dispatch({
      type: 'SELECT_TASK',
      payload: task,
    });
    if (isPlatformIOS()) {
      dispatch({ type: 'SET_MODAL', payload: ActiveModal.SelectedTask });
    } else {
      dispatch(push(`/${MainView.Board}/${ActiveModal.SelectedTask}${search}`) as any);
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
      />
      <label htmlFor={uniqId} className="cbx">
        <span>
          <svg width="12px" height="9px" viewBox="0 0 12 9">
            <polyline points="1 5 4 8 11 1" />
          </svg>
        </span>
        <div
          onClick={selectTask}
          className={`useMonrope ${css({ fontSize: '15px', fontWeight: 500, overflow: 'hidden' })}`}
        >
          {task.name}
        </div>
      </label>
    </span>
  );
});
