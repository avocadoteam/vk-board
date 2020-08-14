import { AppEpic, FetchingStateName, AppDispatch, FetchResponse, BoardListIiem } from 'core/models';
import { ofType } from 'redux-observable';
import { filter, switchMap, map } from 'rxjs/operators';
import { from, of, concat } from 'rxjs';
import { captureFetchError } from './errors';
import { getBoard } from 'core/operations/board';
import { safeCombineEpics } from './combine';
import { getQToQuery } from 'core/selectors/user';

const fetchBoardEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.Board),
    map(() => ({
      q: getQToQuery(state$.value),
    })),
    switchMap(({ q }) =>
      getBoard(q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return from(response.json() as Promise<FetchResponse<BoardListIiem[]>>).pipe(
              map((v) => v?.data ?? []),
              switchMap((data) => {
                const selectedId = state$.value.ui.board.selectedBoardListId;

                if (!data.find((bl) => bl.id === selectedId)) {
                  return concat(
                    of({
                      type: 'SET_READY_DATA',
                      payload: {
                        name: FetchingStateName.Board,
                        data,
                      },
                    } as AppDispatch),
                    of({
                      type: 'SELECT_BOARD_LIST',
                      payload: data[0]?.id,
                    } as AppDispatch),
                    of({
                      type: 'SET_UPDATING_DATA',
                      payload: FetchingStateName.Tasks,
                    } as AppDispatch)
                  );
                }

                return concat(
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.Board,
                      data,
                    },
                  } as AppDispatch),
                  of({
                    type: 'SET_UPDATING_DATA',
                    payload: FetchingStateName.Tasks,
                  } as AppDispatch)
                );
              })
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchError(FetchingStateName.Board)
      )
    )
  );

export const boardEpics = safeCombineEpics(fetchBoardEpic);
