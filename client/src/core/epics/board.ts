import { replace } from 'connected-react-router';
import {
  AppDispatch,
  AppEpic,
  AppUser,
  BoardListItem,
  EditBoardListNameAction,
  FetchingStateName,
  FetchReadyAction,
  FetchResponse,
  Skeys,
} from 'core/models';
import { editBoardList, getBoard, newBoardList } from 'core/operations/board';
import { deletBoardList } from 'core/operations/boardList';
import { getSelectedListId, selectedBoardListInfo } from 'core/selectors/boardLists';
import { getLocationMainPath } from 'core/selectors/router';
import { getQToQuery } from 'core/selectors/user';
import { safeTrim } from 'core/utils';
import { ofType } from 'redux-observable';
import { concat, from, iif, of } from 'rxjs';
import { auditTime, debounceTime, delay, exhaustMap, filter, map, switchMap } from 'rxjs/operators';
import { setStorageValueEpic, useTapticEpic } from './addons';
import { safeCombineEpics } from './combine';
import { captureFetchError, captureFetchErrorWithTaptic } from './errors';
import { getBoardListData } from 'core/selectors/board';

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
                const state = state$.value;
                const id = getSelectedListId(state);
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
                      id: boardDataList.id,
                      data: boardDataList,
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
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.NewBoardList),
    map(() => ({
      q: getQToQuery(state$.value),
      listName: state$.value.ui.board.boardListName,
    })),
    switchMap(({ q, listName }) =>
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
              return from(response.json() as Promise<FetchResponse<number>>).pipe(
                switchMap((response) => {
                  return concat(
                    of({
                      type: 'SELECT_BOARD_LIST',
                      payload: {
                        id: response.data,
                      },
                    } as AppDispatch),
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
                    useTapticEpic('success'),
                    of({
                      type: 'SET_BOARD_LIST_NAME',
                      payload: '',
                    } as AppDispatch)
                  );
                })
              );
            } else {
              throw new Error(`Http ${response.status} on ${response.url}`);
            }
          }),
          captureFetchErrorWithTaptic(
            FetchingStateName.NewBoardList,
            'Не удалось сохранить новый список'
          )
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
            const state = state$.value;
            const boardLists = getBoardListData(state);
            const firstAvailList = boardLists.filter((l) => l.id !== listId)[0];
            const info = selectedBoardListInfo(state);
            const actions: AppDispatch[] = [];

            if (firstAvailList && info.id === listId) {
              actions.push({
                type: 'SELECT_BOARD_LIST',
                payload: {
                  id: firstAvailList.id,
                  data: firstAvailList,
                },
              });
              actions.push({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.Tasks });
            } else if (info.id === listId) {
              actions.push({
                type: 'SELECT_BOARD_LIST',
                payload: {
                  id: 0,
                  data: {
                    created: '',
                    createdBy: 0,
                    id: 0,
                    listguid: '',
                    memberships: [],
                    name: '',
                  },
                },
              });
              actions.push({
                type: 'SET_BOARD_TASKS',
                payload: [],
              });
            }

            const newBoardLists = boardLists.reduce((acc, list) => {
              if (list.id === listId) {
                return acc;
              }

              return acc.concat(list);
            }, [] as BoardListItem[]);

            actions.push({
              type: 'SET_READY_DATA',
              payload: {
                name: FetchingStateName.Board,
                data: newBoardLists,
              },
            });
            actions.push({
              type: 'SET_READY_DATA',
              payload: {
                name: FetchingStateName.DeleteBoardList,
                data: true,
              },
            });
            return concat(...actions.map((a) => of(a)));
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
    filter<EditBoardListNameAction>(({ payload }) => !!payload.id),
    debounceTime(1500),
    map((p) => ({
      q: getQToQuery(state$.value),
      listName: safeTrim(state$.value.ui.board.editBoardListName),
      listId: p.payload.id!,
    })),
    switchMap(({ q, listName, listId }) =>
      iif(
        () => !listName.length,
        concat(
          of({
            type: 'SET_ERROR_DATA',
            payload: {
              name: FetchingStateName.EditBoardList,
              error: 'Вы ввели пустое название. Исправьте!',
            },
          } as AppDispatch),
          useTapticEpic('error')
        ),
        editBoardList(listName, listId, q).pipe(
          switchMap((response) => {
            if (response.ok) {
              return concat(
                of({
                  type: 'SET_READY_DATA',
                  payload: {
                    name: FetchingStateName.EditBoardList,
                    data: true,
                  },
                } as AppDispatch),
                useTapticEpic('success')
              );
            } else {
              throw new Error(`Http ${response.status} on ${response.url}`);
            }
          }),
          captureFetchErrorWithTaptic(
            FetchingStateName.EditBoardList,
            'Не удалось обновить название списока'
          )
        )
      )
    )
  );

const resetPutListActionsEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_READY_DATA'),
    filter<FetchReadyAction>(
      ({ payload }) =>
        (payload.name === FetchingStateName.EditBoardList ||
          payload.name === FetchingStateName.NewBoardList) &&
        !!payload.data
    ),
    auditTime(100),
    delay(2500),
    exhaustMap(({ payload }) =>
      of({ type: 'SET_READY_DATA', payload: { name: payload.name, data: false } } as AppDispatch)
    )
  );

const firstBoardListEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.FirstBoardList),
    map(() => {
      const state = state$.value;
      return {
        q: getQToQuery(state),
        listName: state.ui.board.firstBoardListName,
        mainView: getLocationMainPath(state),
      };
    }),
    switchMap(({ q, listName, mainView }) =>
      newBoardList(listName, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return from(response.json() as Promise<FetchResponse<number>>).pipe(
              switchMap((response) => {
                return concat(
                  of({
                    type: 'SELECT_BOARD_LIST',
                    payload: {
                      id: response.data,
                    },
                  } as AppDispatch),
                  of({
                    type: 'SET_UPDATING_DATA',
                    payload: FetchingStateName.Board,
                  } as AppDispatch),
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.FirstBoardList,
                      data: true,
                    },
                  } as AppDispatch),
                  of({
                    type: 'SET_APP_USER',
                    payload: true,
                  } as AppDispatch),
                  useTapticEpic('success'),
                  of(replace(`/${mainView}${q}`) as any),
                  setStorageValueEpic(Skeys.appUser, AppUser.Yes)
                );
              })
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchErrorWithTaptic(FetchingStateName.FirstBoardList, 'Не удалось создать список')
      )
    )
  );

export const boardEpics = safeCombineEpics(
  fetchBoardEpic,
  saveBoardListEpic,
  deleteBoardListEpic,
  editBoardListNameEpic,
  resetPutListActionsEpic,
  firstBoardListEpic
);
