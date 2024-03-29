import {
  AppEpic,
  FetchingStateName,
  AppDispatch,
  SetHashAction,
  FetchResponse,
  FetchUpdateAction,
  MembershipListPreview,
  MainView,
} from 'core/models';
import { ofType } from 'redux-observable';
import { filter, map, switchMap } from 'rxjs/operators';
import { getBoardUiState, getMembershipUiState } from 'core/selectors/common';
import { getQToQuery } from 'core/selectors/user';
import {
  dropMembership,
  createMembership,
  listMembershipPreview,
} from 'core/operations/membership';
import { concat, of, from } from 'rxjs';
import { captureFetchError, captureFetchErrorWithTaptic } from './errors';
import { safeCombineEpics } from './combine';
import { getSearch, push, replace } from 'connected-react-router';
import { getBoardListData } from 'core/selectors/board';
import { getPreviewMembershipData } from 'core/selectors/membership';
import { useTapticEpic } from './addons';

const dropMembershipEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.DropMembership),
    map(() => {
      const state = state$.value;
      const { boardListOpenId } = getBoardUiState(state);
      const { dropUserId } = getMembershipUiState(state);

      return {
        q: getQToQuery(state),
        userId: dropUserId,
        listId: boardListOpenId,
      };
    }),
    switchMap(({ q, userId, listId }) =>
      dropMembership(userId, listId, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return concat(
              of({
                type: 'SET_READY_DATA',
                payload: {
                  name: FetchingStateName.DropMembership,
                  data: true,
                },
              } as AppDispatch)
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchError(FetchingStateName.DropMembership)
      )
    )
  );

const procceedToPreviewMembershipListEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_HASH'),
    filter<SetHashAction>(
      ({ payload }) =>
        payload !== null &&
        !getBoardListData(state$.value).find((l) => l.listguid === payload) &&
        payload.length > 30
    ),
    map(({ payload }) => ({
      q: getSearch(state$.value),
      guid: payload!,
    })),
    map(
      () =>
        ({
          type: 'SET_UPDATING_DATA',
          payload: FetchingStateName.ListMembershipPreview,
        } as AppDispatch)
    )
  );

const getPreviewMembershipListEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter<FetchUpdateAction>(({ payload }) => payload === FetchingStateName.ListMembershipPreview),
    map(() => ({
      q: getSearch(state$.value),
      guid: state$.value.ui.hashListGUID!,
    })),
    switchMap(({ q, guid }) =>
      listMembershipPreview(guid, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return from(
              response.json() as Promise<FetchResponse<MembershipListPreview | 'Yourself'>>
            ).pipe(
              switchMap((r) => {
                if (r?.data === 'Yourself') {
                  return concat(
                    of({
                      type: 'SET_ERROR_DATA',
                      payload: {
                        name: FetchingStateName.ListMembershipPreview,
                        error: 'Это Ваша ссылка',
                      },
                    } as AppDispatch),
                    useTapticEpic('error')
                  );
                }
                return concat(
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.ListMembershipPreview,
                      data: r?.data,
                    },
                  } as AppDispatch),
                  of(push(`/${MainView.ListSharePreview}${q}`) as any)
                );
              })
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchErrorWithTaptic(
          FetchingStateName.ListMembershipPreview,
          'Ссылка недействительна или Вы уже в списке'
        )
      )
    )
  );

const saveMembershipEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter<FetchUpdateAction>(({ payload }) => payload === FetchingStateName.SaveMembership),
    map(() => ({
      q: getSearch(state$.value),
      listId: getPreviewMembershipData(state$.value).id,
    })),
    switchMap(({ q, listId }) =>
      createMembership(listId, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return from(response.json() as Promise<FetchResponse<number>>).pipe(
              switchMap((r) => {
                return concat(
                  of({
                    type: 'SELECT_BOARD_LIST',
                    payload: {
                      id: r?.data ?? 0,
                    },
                  } as AppDispatch),
                  of({
                    type: 'SET_UPDATING_DATA',
                    payload: FetchingStateName.Board,
                  } as AppDispatch),
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.SaveMembership,
                      data: true,
                    },
                  } as AppDispatch),
                  of(replace(`/${q}`) as any),
                  useTapticEpic('success')
                );
              })
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchErrorWithTaptic(
          FetchingStateName.SaveMembership,
          'Не получилось Вас добавить в список'
        )
      )
    )
  );

export const membershipEpics = safeCombineEpics(
  dropMembershipEpic,
  procceedToPreviewMembershipListEpic,
  getPreviewMembershipListEpic,
  saveMembershipEpic
);
