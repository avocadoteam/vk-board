import { combineEpics, Epic } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { userEpics } from './user';
import { getAdsEpic } from './ads';
import { captureUrlEvent } from 'core/sentry';
import { errMap } from 'core/utils';
import { boardEpics } from './board';
import { taskEpics } from './tasks';
import { membershipEpics } from './membership';
import { socketEpics } from './socket';

export const rootEpic: Epic = (action$, store$, dependencies) =>
  combineEpics(
    userEpics,
    getAdsEpic,
    boardEpics,
    taskEpics,
    membershipEpics,
    socketEpics
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error('Error in root epic', error);
      captureUrlEvent(`Error in root epic ${errMap(error)}`);
      return source;
    })
  );
