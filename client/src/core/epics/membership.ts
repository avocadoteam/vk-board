import { AppEpic, FetchingStateName, AppDispatch, SetHashAction, FetchResponse } from 'core/models';
import { ofType } from 'redux-observable';
import { filter, map, switchMap } from 'rxjs/operators';
import { getBoardUiState, getMembershipUiState } from 'core/selectors/common';
import { getQToQuery } from 'core/selectors/user';
import { dropMembership, createMembership } from 'core/operations/membership';
import { concat, of, from } from 'rxjs';
import { captureFetchError, captureFetchErrorWithTaptic } from './errors';
import { safeCombineEpics } from './combine';
import { getSearch } from 'connected-react-router';

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
                type: 'SET_UPDATING_DATA',
                payload: FetchingStateName.Board,
              } as AppDispatch),
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

const saveMembershipEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_HASH'),
    filter<SetHashAction>(({ payload }) => payload !== null),
    map(({ payload }) => ({
      q: getSearch(state$.value),
      guid: payload!,
    })),
    switchMap(({ q, guid }) =>
      createMembership(guid, q).pipe(
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
                      name: FetchingStateName.DropMembership,
                      data: true,
                    },
                  } as AppDispatch)
                );
              })
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchErrorWithTaptic(FetchingStateName.SaveMembership)
      )
    )
  );

export const membershipEpics = safeCombineEpics(dropMembershipEpic, saveMembershipEpic);
