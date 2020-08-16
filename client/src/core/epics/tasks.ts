import {
  AppEpic,
  FetchingStateName,
  NewTaskModel,
  FetchResponse,
  AppDispatch,
  BoardTaskItem,
  FINISH_TASK_TIMER_VALUE,
} from 'core/models';
import { ofType } from 'redux-observable';
import { filter, map, switchMap, auditTime, exhaustMap } from 'rxjs/operators';
import { getNewTaskValues, getBoardUiState } from 'core/selectors/board';
import { getQToQuery } from 'core/selectors/user';
import { from, concat, of, iif } from 'rxjs';
import {
  captureFetchErrorUserErr,
  captureFetchError,
  captureFetchErrorMoreActions,
} from './errors';
import { safeCombineEpics } from './combine';
import { postNewTask, getTasks, finishTasks, deleteTask } from 'core/operations/task';

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
                return concat(
                  of({
                    type: 'SET_MODAL',
                    payload: null,
                  } as AppDispatch),
                  of({
                    type: 'RESET_NEW_TASK',
                    payload: null,
                  } as AppDispatch),
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.NewTask,
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
        captureFetchErrorUserErr(FetchingStateName.Board, 'Не получилось сохранить новую задачу')
      )
    )
  );

const fetchTasksEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.Tasks),
    map(() => ({
      q: getQToQuery(state$.value),
      listId: state$.value.ui.board.selectedBoardListId,
    })),
    switchMap(({ q, listId }) =>
      getTasks(listId, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return from(response.json() as Promise<FetchResponse<BoardTaskItem[]>>).pipe(
              map((v) => v?.data ?? []),
              switchMap((data) => {
                return of({
                  type: 'SET_READY_DATA',
                  payload: {
                    name: FetchingStateName.Tasks,
                    data,
                  },
                } as AppDispatch);
              })
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchError(FetchingStateName.Tasks)
      )
    )
  );

const finishTasksEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('FINISH_TASK'),
    auditTime(FINISH_TASK_TIMER_VALUE),
    map(() => {
      const state = state$.value;
      const { selectedBoardListId, tasksToBeFinished } = getBoardUiState(state);

      return {
        q: getQToQuery(state),
        taskIds: tasksToBeFinished,
        listId: selectedBoardListId,
      };
    }),
    exhaustMap(({ q, taskIds, listId }) =>
      iif(
        () => !taskIds.length,
        of({
          type: 'SET_FINISH_TASK_TIMER',
          payload: FINISH_TASK_TIMER_VALUE,
        } as AppDispatch),
        finishTasks(taskIds, listId, q).pipe(
          switchMap((response) => {
            if (response.ok) {
              return concat(
                of({
                  type: 'SET_UPDATING_DATA',
                  payload: FetchingStateName.Tasks,
                } as AppDispatch),
                of({
                  type: 'SET_FINISH_TASK_TIMER',
                  payload: FINISH_TASK_TIMER_VALUE,
                } as AppDispatch),
                of({
                  type: 'RESET_FINISH_TASKS',
                  payload: [],
                } as AppDispatch)
              );
            } else {
              throw new Error(`Http ${response.status} on ${response.url}`);
            }
          }),
          captureFetchErrorMoreActions(FetchingStateName.FinishTasks, {
            type: 'SET_FINISH_TASK_TIMER',
            payload: FINISH_TASK_TIMER_VALUE,
          })
        )
      )
    )
  );

const deleteTaskEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.DeleteTask),
    map(() => {
      const state = state$.value;
      const { selectedBoardListId, selectedTask } = getBoardUiState(state);

      return {
        q: getQToQuery(state),
        selectedTaskId: selectedTask.id,
        listId: selectedBoardListId,
      };
    }),
    switchMap(({ q, selectedTaskId, listId }) =>
      deleteTask(selectedTaskId, listId, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return concat(
              of({
                type: 'SET_UPDATING_DATA',
                payload: FetchingStateName.Tasks,
              } as AppDispatch),
              of({
                type: 'SET_READY_DATA',
                payload: {
                  name: FetchingStateName.DeleteTask,
                  data: true,
                },
              } as AppDispatch),
              of({
                type: 'SET_MODAL',
                payload: null,
              } as AppDispatch)
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchError(FetchingStateName.DeleteTask)
      )
    )
  );

export const taskEpics = safeCombineEpics(
  postNewTaskEpic,
  fetchTasksEpic,
  finishTasksEpic,
  deleteTaskEpic
);
