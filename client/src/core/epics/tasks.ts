import {
  AppEpic,
  FetchingStateName,
  NewTaskModel,
  FetchResponse,
  AppDispatch,
  BoardTaskItem,
} from 'core/models';
import { ofType } from 'redux-observable';
import { filter, map, switchMap, auditTime } from 'rxjs/operators';
import { getNewTaskValues, getBoardUiState } from 'core/selectors/board';
import { getQToQuery } from 'core/selectors/user';
import { from, concat, of } from 'rxjs';
import { captureFetchErrorUserErr, captureFetchError } from './errors';
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
    auditTime(3500),
    map(() => {
      const state = state$.value;
      const { selectedBoardListId, tasksToBeFinished } = getBoardUiState(state);

      return {
        q: getQToQuery(state),
        taskIds: tasksToBeFinished,
        listId: selectedBoardListId,
      };
    }),
    filter((v) => !!v.taskIds.length),
    switchMap(({ q, taskIds, listId }) =>
      finishTasks(taskIds, listId, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return of({
              type: 'SET_UPDATING_DATA',
              payload: FetchingStateName.Tasks,
            } as AppDispatch);
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchError(FetchingStateName.FinishTasks)
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
