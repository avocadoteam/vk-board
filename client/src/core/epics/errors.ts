import { FetchingStateName, AppDispatch } from 'core/models';
import { catchError } from 'rxjs/operators';
import { ObservableInput, of, concat } from 'rxjs';
import { captureUrlEvent } from 'core/sentry';
import { errMap } from 'core/utils';

export const captureFetchError = (name: FetchingStateName) =>
  catchError<AppDispatch, ObservableInput<AppDispatch>>((error, o) => {
    console.error('Error in', name, errMap(error));
    captureUrlEvent(`Error in ${name} ${errMap(error)}`);
    return of({
      type: 'SET_ERROR_DATA',
      payload: {
        name,
        error: `Cannot load ${name} data`,
      },
    });
  });

export const captureFetchErrorMoreActions = (name: FetchingStateName, ...actions: AppDispatch[]) =>
  catchError<AppDispatch, ObservableInput<AppDispatch>>((error, o) => {
    console.error('Error in', name, errMap(error));
    captureUrlEvent(`Error in ${name} ${errMap(error)}`);
    return concat(
      of({
        type: 'SET_ERROR_DATA',
        payload: {
          name,
          error: `Cannot load ${name} data`,
        },
      } as AppDispatch),
      ...actions.map((a) => of(a))
    );
  });
export const captureErrorFallbackActions = (context: string, ...actions: AppDispatch[]) =>
  catchError<AppDispatch, ObservableInput<AppDispatch>>((error, o) => {
    console.error('Error in', context, errMap(error));
    captureUrlEvent(`Error in ${context} ${errMap(error)}`);
    return concat(...actions.map((a) => of(a)));
  });

export const captureFetchErrorUserErr = (name: FetchingStateName, err: string) =>
  catchError<AppDispatch, ObservableInput<AppDispatch>>((error, o) => {
    console.error('Error in', name, errMap(error));
    captureUrlEvent(`Error in ${name} ${errMap(error)}`);
    return of({
      type: 'SET_ERROR_DATA',
      payload: {
        name,
        error: err,
      },
    });
  });
