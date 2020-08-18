import { AppEpic, FetchingStateName, AppDispatch } from 'core/models';
import { ofType } from 'redux-observable';
import { filter, map, switchMap } from 'rxjs/operators';
import { getBoardUiState, getMembershipUiState } from 'core/selectors/common';
import { getQToQuery } from 'core/selectors/user';
import { dropMembership } from 'core/operations/membership';
import { concat, of } from 'rxjs';
import { captureFetchError } from './errors';
import { safeCombineEpics } from './combine';

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

export const membershipEpics = safeCombineEpics(dropMembershipEpic);
