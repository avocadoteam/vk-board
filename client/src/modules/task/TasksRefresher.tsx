import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PullToRefresh } from '@vkontakte/vkui';
import { FetchingStateName, AppDispatchActions } from 'core/models';
import { getSelectedListId } from 'core/selectors/boardLists';
import { isTasksUpdating } from 'core/selectors/task';

type Props = {
  children: React.ReactNode;
};

export const TasksRefresher = React.memo<Props>(({ children }) => {
  const listId = useSelector(getSelectedListId);
  const tasksUpdating = useSelector(isTasksUpdating);
  const dispatch = useDispatch<AppDispatchActions>();

  const refreshTasks = React.useCallback(() => {
    dispatch({
      type: 'SET_UPDATING_DATA',
      payload: FetchingStateName.Tasks,
    });
  }, []);

  if (listId) {
    return (
      <PullToRefresh onRefresh={refreshTasks} isFetching={tasksUpdating}>
        {children}
      </PullToRefresh>
    );
  }

  return <>{children}</>;
});
