import {
  AppEpic,
  FetchingStateName,
  NewTaskModel,
  FetchResponse,
  AppDispatch,
  BoardTaskItem,
  FINISH_TASK_TIMER_VALUE,
  EditTaskModel,
  UNFINISH_TASK_TIMER_VALUE,
} from 'core/models';
import { ofType } from 'redux-observable';
import { filter, map, switchMap, auditTime, exhaustMap } from 'rxjs/operators';
import { getNewTaskValues, getEditTaskValues } from 'core/selectors/board';
import { getQToQuery } from 'core/selectors/user';
import { from, concat, of, iif, empty } from 'rxjs';
import {
  captureFetchErrorUserErr,
  captureFetchError,
  captureFetchErrorMoreActions,
} from './errors';
import { safeCombineEpics } from './combine';
import * as ops from 'core/operations/task';
import { getBoardUiState } from 'core/selectors/common';
import { getSelectedTaskId, getSelectedTaskGUID } from 'core/selectors/task';
import { getSelectedListId } from 'core/selectors/boardLists';

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
          description: formValues.description || null,
          dueDate: formValues.dueDate || null,
          listId: getSelectedListId(state),
        } as NewTaskModel,
      };
    }),
    switchMap(({ q, data }) =>
      ops.postNewTask(data, q).pipe(
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
        captureFetchErrorUserErr(FetchingStateName.NewTask, 'Не получилось сохранить новую задачу')
      )
    )
  );

const fetchTasksEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.Tasks),
    map(() => ({
      q: getQToQuery(state$.value),
      listId: getSelectedListId(state$.value),
    })),
    switchMap(({ q, listId }) =>
      ops.getTasks(listId, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return from(response.json() as Promise<FetchResponse<BoardTaskItem[]>>).pipe(
              map((v) => v?.data ?? []),
              switchMap((data) => {
                return concat(
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.Tasks,
                      data,
                    },
                  } as AppDispatch),
                  of({
                    type: 'SET_BOARD_TASKS',
                    payload: data,
                  } as AppDispatch)
                );
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
      const { tasksToBeFinished } = getBoardUiState(state);

      return {
        q: getQToQuery(state),
        taskIds: tasksToBeFinished,
        listId: getSelectedListId(state),
      };
    }),
    exhaustMap(({ q, taskIds, listId }) =>
      iif(
        () => !taskIds.length,
        of({
          type: 'SET_FINISH_TASK_TIMER',
          payload: FINISH_TASK_TIMER_VALUE,
        } as AppDispatch),
        ops.finishTasks(taskIds, listId, q).pipe(
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
      const { selectedTask } = getBoardUiState(state);

      return {
        q: getQToQuery(state),
        selectedTaskId: selectedTask.id,
        listId: getSelectedListId(state),
      };
    }),
    switchMap(({ q, selectedTaskId, listId }) =>
      ops.deleteTask(selectedTaskId, listId, q).pipe(
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

const putEditTaskEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.EditTask),
    map(() => {
      const state = state$.value;
      const formValues = getEditTaskValues(state);
      return {
        q: getQToQuery(state),
        dataModel: {
          ...formValues,
          dueDate: formValues.dueDate || null,
          listId: getSelectedListId(state),
          id: getSelectedTaskId(state),
        } as EditTaskModel,
      };
    }),
    switchMap(({ q, dataModel }) =>
      ops.putEditTask(dataModel, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return from(response.json() as Promise<FetchResponse<number>>).pipe(
              switchMap(() => {
                return concat(
                  of({
                    type: 'SELECT_TASK',
                    payload: {
                      id: dataModel.id,
                      description: dataModel.description,
                      dueDate: dataModel.dueDate,
                      name: dataModel.name,
                      taskGUID: getSelectedTaskGUID(state$.value),
                    },
                  } as AppDispatch),
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.EditTask,
                      data: true,
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
        captureFetchErrorUserErr(FetchingStateName.EditTask, 'Не получилось обновить задачу')
      )
    )
  );

const unfinishTasksEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('UNFINISH_TASK'),
    auditTime(UNFINISH_TASK_TIMER_VALUE),
    map(() => {
      const state = state$.value;
      const { tasksToBeUnfinished } = getBoardUiState(state);

      return {
        q: getQToQuery(state),
        taskIds: tasksToBeUnfinished,
        listId: getSelectedListId(state),
      };
    }),
    exhaustMap(({ q, taskIds, listId }) =>
      iif(
        () => !taskIds.length,
        empty(),
        ops.unfinishTasks(taskIds, listId, q).pipe(
          switchMap((response) => {
            if (response.ok) {
              return concat(
                of({
                  type: 'SET_UPDATING_DATA',
                  payload: FetchingStateName.Tasks,
                } as AppDispatch),
                of({
                  type: 'RESET_UNFINISH_TASKS',
                  payload: [],
                } as AppDispatch)
              );
            } else {
              throw new Error(`Http ${response.status} on ${response.url}`);
            }
          }),
          captureFetchError(FetchingStateName.FinishTasks)
        )
      )
    )
  );

export const taskEpics = safeCombineEpics(
  postNewTaskEpic,
  fetchTasksEpic,
  finishTasksEpic,
  deleteTaskEpic,
  putEditTaskEpic,
  unfinishTasksEpic
);
