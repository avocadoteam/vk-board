import { AppEpic, FetchingStateName, AppDispatch, FetchResponse, BoardListIiem } from 'core/models';
import { ofType } from 'redux-observable';
import { filter, switchMap, map, debounceTime, exhaustMap } from 'rxjs/operators';
import { from, of, concat, iif } from 'rxjs';
import { captureFetchError } from './errors';
import { getBoard, newBoardList } from 'core/operations/board';
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

const saveBoardListEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_BOARD_LIST_NAME'),
    debounceTime(1500),
    map(() => ({
      q: getQToQuery(state$.value),
      listName: state$.value.ui.board.boardListName,
    })),
    exhaustMap(({ q, listName }) =>
      iif(
        () => !listName.length,
        of({
          type: 'SET_READY_DATA',
          payload: {
            name: FetchingStateName.NewBoardList,
            data: false,
          },
        } as AppDispatch),
        newBoardList(listName, q).pipe(
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
                    name: FetchingStateName.NewBoardList,
                    data: true,
                  },
                } as AppDispatch)
              );
            } else {
              throw new Error(`Http ${response.status} on ${response.url}`);
            }
          }),
          captureFetchError(FetchingStateName.NewBoardList)
        )
      )
    )
  );

export const boardEpics = safeCombineEpics(fetchBoardEpic, saveBoardListEpic);
