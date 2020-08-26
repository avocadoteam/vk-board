import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Main } from 'roots/Main';
import { FetchingStateName, AppDispatchActions } from 'core/models';
import { ErrorBoundary } from 'modules/error-bound';
import { connectListSocket } from 'core/socket/list';
import { getSearch } from 'connected-react-router';

export const Router = React.memo(() => {
  const dispatch = useDispatch<AppDispatchActions>();
  const search = useSelector(getSearch);

  React.useEffect(() => {
    dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.User });
    connectListSocket(search);
  }, []);

  return (
    <ErrorBoundary>
      <Main />
    </ErrorBoundary>
  );
});
