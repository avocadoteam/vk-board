import {
  AppEpic,
  FetchingStateName,
  AppDispatch,
  FetchResponse,
  BoardListItem,
  EditBoardNamePayload,
  FeatchReadyAction,
} from 'core/models';
import { ofType } from 'redux-observable';
import { filter, switchMap, map, debounceTime, exhaustMap, delay, auditTime } from 'rxjs/operators';
import { from, of, concat, iif } from 'rxjs';
import { captureFetchError, captureFetchErrorWithTaptic } from './errors';
import { getBoard, newBoardList, editBoardList } from 'core/operations/board';
import { safeCombineEpics } from './combine';
import { getQToQuery } from 'core/selectors/user';
import { deletBoardList } from 'core/operations/boardList';
import { selectedBoardListInfo } from 'core/selectors/boardLists';
import { tapTaptic } from './addons';

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
            return from(response.json() as Promise<FetchResponse<BoardListItem[]>>).pipe(
              map((v) => v?.data ?? []),
              switchMap((data) => {
                const { id, name } = selectedBoardListInfo(state$.value);
                const boardDataList = data.find((bl) => bl.id === id);
                if (!boardDataList) {
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
                      payload: {
                        id: data[0]?.id,
                        data: data[0],
                      },
                    } as AppDispatch),
                    of({
                      type: 'SET_UPDATING_DATA',
                      payload: FetchingStateName.Tasks,
                    } as AppDispatch)
                  );
                }

                if (boardDataList.name !== name) {
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
                      payload: {
                        id,
                        data: boardDataList,
                      },
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
                } as AppDispatch),
                tapTaptic('success')
              );
            } else {
              throw new Error(`Http ${response.status} on ${response.url}`);
            }
          }),
          captureFetchErrorWithTaptic(FetchingStateName.NewBoardList)
        )
      )
    )
  );

const deleteBoardListEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.DeleteBoardList),
    map(() => {
      const state = state$.value;
      return {
        q: getQToQuery(state),
        listId: state.ui.board.boardListToDeleteId,
      };
    }),
    exhaustMap(({ q, listId }) =>
      deletBoardList(listId, q).pipe(
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
                  name: FetchingStateName.DeleteBoardList,
                  data: true,
                },
              } as AppDispatch)
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchError(FetchingStateName.DeleteBoardList)
      )
    )
  );

const editBoardListNameEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('EDIT_BOARD_LIST_NAME'),
    filter(({ payload }) => !!(payload as EditBoardNamePayload).id),
    debounceTime(1500),
    map((p) => ({
      q: getQToQuery(state$.value),
      listName: state$.value.ui.board.editBoardListName,
      listId: (p.payload as EditBoardNamePayload).id!,
    })),
    exhaustMap(({ q, listName, listId }) =>
      iif(
        () => !listName.length,
        of({
          type: 'SET_READY_DATA',
          payload: {
            name: FetchingStateName.EditBoardList,
            data: false,
          },
        } as AppDispatch),
        editBoardList(listName, listId, q).pipe(
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
                    name: FetchingStateName.EditBoardList,
                    data: true,
                  },
                } as AppDispatch),
                tapTaptic('success')
              );
            } else {
              throw new Error(`Http ${response.status} on ${response.url}`);
            }
          }),
          captureFetchErrorWithTaptic(FetchingStateName.EditBoardList)
        )
      )
    )
  );

const resetPutListActionsEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_READY_DATA'),
    filter<FeatchReadyAction>(
      ({ payload }) =>
        (payload.name === FetchingStateName.EditBoardList ||
          payload.name === FetchingStateName.NewBoardList) &&
        !!payload.data
    ),
    auditTime(100),
    delay(2500),
    exhaustMap(({ payload }) =>
      map(
        () =>
          ({ type: 'SET_READY_DATA', payload: { name: payload.name, data: false } } as AppDispatch)
      )
    )
  );

export const boardEpics = safeCombineEpics(
  fetchBoardEpic,
  saveBoardListEpic,
  deleteBoardListEpic,
  editBoardListNameEpic,
  resetPutListActionsEpic
);
