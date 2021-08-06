import { goBack } from 'connected-react-router';
import {
  AppDispatch,
  AppEpic,
  BoardTaskItem,
  EditTaskModel,
  FetchingStateName,
  FetchResponse,
  FetchUpdateAction,
  FINISH_TASK_TIMER_VALUE,
  MainView,
  NewTaskModel,
  TaskInfo,
  UNFINISH_TASK_TIMER_VALUE,
} from 'core/models';
import * as ops from 'core/operations/task';
import { getEditTaskValues, getNewTaskValues } from 'core/selectors/board';
import { getSelectedList, getSelectedListId } from 'core/selectors/boardLists';
import { getBoardUiState } from 'core/selectors/common';
import { isPlatformIOS } from 'core/selectors/settings';
import { getSelectedTaskId, getSelectedTaskNotification } from 'core/selectors/task';
import { getQToQuery } from 'core/selectors/user';
import { timeBasedOnTz } from 'core/utils/time';
import { ofType } from 'redux-observable';
import { concat, empty, from, iif, of } from 'rxjs';
import { debounceTime, exhaustMap, filter, map, switchMap } from 'rxjs/operators';
import { safeCombineEpics } from './combine';
import {
  captureFetchError,
  captureFetchErrorMoreActions,
  captureFetchErrorUserErr,
  captureFetchErrorWithTaptic,
} from './errors';

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
            return from(response.json() as Promise<FetchResponse<string>>).pipe(
              switchMap((r) => {
                const actions: AppDispatch[] = [];
                const { tasks } = getSelectedList(state$.value);

                if (!tasks.find((t) => String(t.id) === String(r?.data))) {
                  actions.push({
                    type: 'SET_BOARD_TASKS',
                    payload: [
                      {
                        id: r.data,
                        created: timeBasedOnTz(new Date()),
                        deleted: null,
                        description: data.description,
                        dueDate: data.dueDate,
                        finished: null,
                        memberships: [],
                        name: data.name,
                        notification: data.notification,
                      },
                      ...tasks,
                    ],
                  });
                }
                return concat(
                  ...actions.map((a) => of(a)),
                  of(
                    isPlatformIOS()
                      ? ({ type: 'SET_MAIN_VIEW', payload: MainView.Board } as AppDispatch)
                      : (goBack() as any)
                  ),
                  of({
                    type: 'RESET_NEW_TASK',
                    payload: null,
                  } as AppDispatch),
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.NewTask,
                      data: r?.data,
                    },
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

const finishTasksResetEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter((a) => a.type === 'FINISH_TASK' || a.type === 'REMOVE_FINISH_TASK'),
    map(() => {
      const state = state$.value;
      const { tasksToBeFinished } = getBoardUiState(state);
      return tasksToBeFinished.length;
    }),
    switchMap((finishedLength) =>
      iif(
        () => !!finishedLength,
        empty(),
        of({
          type: 'SET_FINISH_TASK_TIMER',
          payload: FINISH_TASK_TIMER_VALUE,
        } as AppDispatch)
      )
    )
  );

const finishTasksEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_FINISH_TASK_TIMER'),
    filter((a) => a.payload === 0),
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
        empty(),
        ops.finishTasks(taskIds, listId, q).pipe(
          switchMap((response) => {
            if (response.ok) {
              return concat(
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
      const { selectedTask, tasksToBeFinished } = getBoardUiState(state);

      return {
        q: getQToQuery(state),
        selectedTaskId: selectedTask.id,
        listId: getSelectedListId(state),
        tasksToBeFinished,
      };
    }),
    switchMap(({ q, selectedTaskId, listId, tasksToBeFinished }) =>
      ops.deleteTask(selectedTaskId, listId, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            const actions: AppDispatch[] = [
              {
                type: 'SET_READY_DATA',
                payload: {
                  name: FetchingStateName.DeleteTask,
                  data: true,
                },
              },
            ];

            if (tasksToBeFinished.includes(selectedTaskId)) {
              actions.push({
                type: 'REMOVE_FINISH_TASK',
                payload: selectedTaskId,
              });
            }

            return concat(
              ...actions.map((a) => of(a)),
              of(
                isPlatformIOS()
                  ? ({ type: 'SET_MAIN_VIEW', payload: MainView.Board } as AppDispatch)
                  : (goBack() as any)
              )
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchErrorUserErr(FetchingStateName.DeleteTask, 'Не получилось удалить задачу')
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
          description: formValues.description || null,
          listId: getSelectedListId(state),
          id: getSelectedTaskId(state),
          notification: getSelectedTaskNotification(state),
        } as EditTaskModel,
      };
    }),
    switchMap(({ q, dataModel }) =>
      ops.putEditTask(dataModel, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return from(response.json() as Promise<FetchResponse<number>>).pipe(
              switchMap(() => {
                const newTaskModel: TaskInfo = {
                  id: dataModel.id,
                  description: dataModel.description,
                  dueDate: dataModel.dueDate,
                  name: dataModel.name,
                  notification: dataModel.notification,
                };

                return concat(
                  of({
                    type: 'SELECT_TASK',
                    payload: newTaskModel,
                  } as AppDispatch),
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.EditTask,
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
        captureFetchErrorUserErr(FetchingStateName.EditTask, 'Не получилось обновить задачу')
      )
    )
  );

const unfinishTasksEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('UNFINISH_TASK'),
    debounceTime(UNFINISH_TASK_TIMER_VALUE),
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

const changeTaskNotificationEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter<FetchUpdateAction>(({ payload }) => payload === FetchingStateName.NotificationTask),
    map(({ params }) => {
      const state = state$.value;
      const { selectedTask } = getBoardUiState(state);

      return {
        q: getQToQuery(state),
        selectedTaskId: selectedTask.id,
        listId: getSelectedListId(state),
        notification: params?.notification ?? false,
      };
    }),
    switchMap(({ q, selectedTaskId, listId, notification }) =>
      ops.putTaskNotification(notification, selectedTaskId, listId, q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return concat(
              of({
                type: 'SET_READY_DATA',
                payload: {
                  name: FetchingStateName.NotificationTask,
                  data: true,
                },
              } as AppDispatch)
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchErrorWithTaptic(
          FetchingStateName.NotificationTask,
          'Не удалось изменить уведомления для данного задания'
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
  unfinishTasksEpic,
  changeTaskNotificationEpic,
  finishTasksResetEpic
);
