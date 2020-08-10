import { ofType } from 'redux-observable';
import { AppDispatch, FetchingStateName, appUserStorageKey, AppUser, AppEpic } from 'core/models';
import { filter, switchMap, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { getUserData, getIsAppUserFromStorage } from 'core/vk-bridge/user';
import { UserInfo } from '@vkontakte/vk-bridge';
import { getHash, getSearch } from 'connected-react-router';
import { captureFetchError, captureErrorFallbackActions } from './errors';
import { getLocationNotificationEnabled, getLocationVkAppId } from 'core/selectors/router';
import { safeCombineEpics } from './combine';

const getUserInfo: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.User),
    switchMap(() =>
      from(getUserData()).pipe(
        mergeMap((userInfo: UserInfo) => {
          return [
            {
              type: 'SET_READY_DATA',
              payload: {
                name: FetchingStateName.User,
                data: userInfo,
              },
            }
          ] as AppDispatch[];
        }),
        captureFetchError(FetchingStateName.User)
      )
    )
  );

const getIsAppUser: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.User),
    switchMap(() =>
      from(getIsAppUserFromStorage()).pipe(
        mergeMap((result) => {
          const appUserKey = result.keys.find((v) => v.key === appUserStorageKey);
          return [
            {
              type: 'SET_APP_USER',
              payload: appUserKey?.value === AppUser.Yes,
            },
          ] as AppDispatch[];
        }),
        captureErrorFallbackActions('getIsAppUser', {
          type: 'SET_APP_USER',
          payload: false,
        })
      )
    )
  );

const setInitInfo: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.User),
    mergeMap(() => {
      const state = state$.value;
      const hash = getHash(state$.value);
      const q = getSearch(state$.value);
      const hashValue = hash ? Number(hash.split('#').pop()) : null;
      const actions: AppDispatch[] = [
        {
          type: 'SET_NOTIFICATIONS',
          payload: !!getLocationNotificationEnabled(state),
        },
        {
          type: 'SET_APPID',
          payload: getLocationVkAppId(state),
        },
        {
          type: 'SET_HASH',
          payload: !hashValue || isNaN(hashValue) ? null : hashValue,
        },
      ];

      if (!!q) {
        actions.push({
          type: 'SET_INIT_QUERY',
          payload: q,
        });
      }
      return actions;
    })
  );

export const userEpics = safeCombineEpics(getUserInfo, getIsAppUser, setInitInfo);
