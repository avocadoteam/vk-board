import {
  AppEpic,
  FetchingStateName,
  AppDispatch,
  FetchResponse,
  BoardListIiem,
  NewTaskModel,
} from 'core/models';
import { ofType } from 'redux-observable';
import { filter, switchMap, map } from 'rxjs/operators';
import { from, of, concat } from 'rxjs';
import { captureFetchError, captureFetchErrorUserErr } from './errors';
import { getBoard, postNewTask } from 'core/operations/board';
import { safeCombineEpics } from './combine';
import { getQToQuery } from 'core/selectors/user';
import { getNewTaskValues } from 'core/selectors/board';

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
                    } as AppDispatch)
                  );
                }

                return of({
                  type: 'SET_READY_DATA',
                  payload: {
                    name: FetchingStateName.Board,
                    data,
                  },
                } as AppDispatch);
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

// todo: load selected list on save
const postNewTaskEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.NewTask),
    map(() => {
      const state = state$.value;
      const formValues = getNewTaskValues(state);
      return {
        q: getQToQuery(state),
        data: {
          ...formValues,
          dueDate: formValues.dueDate || null,
          listId: state.ui.board.selectedBoardListId,
        } as NewTaskModel,
      };
    }),
    switchMap(({ q, data }) =>
      postNewTask(data, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return from(response.json() as Promise<FetchResponse<number>>).pipe(
              switchMap((data) => {
                return of({
                  type: 'SET_READY_DATA',
                  payload: {
                    name: FetchingStateName.NewTask,
                    data,
                  },
                } as AppDispatch);
              })
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchErrorUserErr(FetchingStateName.Board, 'Не получилось сохранить новую задачу')
      )
    )
  );

export const boardEpics = safeCombineEpics(fetchBoardEpic, postNewTaskEpic);
