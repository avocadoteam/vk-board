import { ofType } from 'redux-observable';
import {
  AppDispatch,
  FetchingStateName,
  AppUser,
  AppEpic,
  Skeys,
  SelectBoardListAction,
} from 'core/models';
import { filter, switchMap, mergeMap, auditTime } from 'rxjs/operators';
import { from } from 'rxjs';
import { getUserData, getUserStorageKeys } from 'core/vk-bridge/user';
import { UserInfo } from '@vkontakte/vk-bridge';
import { getHash, getSearch } from 'connected-react-router';
import { captureFetchErrorMoreActions } from './errors';
import { getLocationNotificationEnabled, getLocationVkAppId } from 'core/selectors/router';
import { safeCombineEpics } from './combine';
import { devTimeout, setStorageValueEpic } from './addons';

const getUserInfo: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.User),
    switchMap(() =>
      from(getUserData()).pipe(
        devTimeout(),
        mergeMap((userInfo: UserInfo) => {
          return [
            {
              type: 'SET_READY_DATA',
              payload: {
                name: FetchingStateName.User,
                data: userInfo,
              },
            },
            {
              type: 'SET_UPDATING_DATA',
              payload: FetchingStateName.PaymentInfo,
            },
            {
              type: 'SET_UPDATING_DATA',
              payload: FetchingStateName.UserSKeys,
            },
            {
              type: 'SET_UPDATING_DATA',
              payload: FetchingStateName.AddToHomeInfo,
            },
          ] as AppDispatch[];
        }),
        captureFetchErrorMoreActions(
          FetchingStateName.User,
          {
            type: 'SET_UPDATING_DATA',
            payload: FetchingStateName.UserSKeys,
          },
          {
            type: 'SET_UPDATING_DATA',
            payload: FetchingStateName.PaymentInfo,
          },
          {
            type: 'SET_UPDATING_DATA',
            payload: FetchingStateName.AddToHomeInfo,
          }
        )
      )
    )
  );

const getUserSKeysEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.UserSKeys),
    switchMap(() =>
      from(getUserStorageKeys()).pipe(
        devTimeout(),
        mergeMap((result) => {
          const isAppUser = result.keys.find((v) => v.key === Skeys.appUser)?.value === AppUser.Yes;
          const selectedListId =
            result.keys.find((v) => v.key === Skeys.userSelectedListId)?.value ?? 1;
          return [
            {
              type: 'SET_APP_USER',
              payload: isAppUser,
            },
            {
              type: 'SELECT_BOARD_LIST',
              payload: {
                id: Number(selectedListId),
              },
            },
            {
              type: 'SET_UPDATING_DATA',
              payload: FetchingStateName.Board,
            },
            {
              type: 'SET_READY_DATA',
              payload: {
                name: FetchingStateName.UserSKeys,
                data: undefined,
              },
            },
          ] as AppDispatch[];
        }),
        captureFetchErrorMoreActions(
          FetchingStateName.UserSKeys,
          {
            type: 'SET_APP_USER',
            payload: false,
          },
          {
            type: 'SET_UPDATING_DATA',
            payload: FetchingStateName.Board,
          }
        )
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
      const hashListGUID = hash ? hash.split('#').pop() : null;
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
          payload: hashListGUID ?? null,
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

const updateUserStorageSelectedListId: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SELECT_BOARD_LIST'),
    auditTime<SelectBoardListAction>(2500),
    switchMap(({ payload }) => setStorageValueEpic(Skeys.userSelectedListId, String(payload.id)))
  );

export const userEpics = safeCombineEpics(
  getUserInfo,
  getUserSKeysEpic,
  setInitInfo,
  updateUserStorageSelectedListId
);
