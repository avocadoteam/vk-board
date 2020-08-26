import { NewTaskModel, EditTaskModel } from 'core/models';
import { request, Method } from './common';

export const postNewTask = (data: NewTaskModel, q: string) =>
  request(`/list/task${q}`, Method.Post, data);

export const getTasks = (listId: number, q: string) =>
  request(`/list/tasks${q}&listId=${listId}`, Method.Get);

export const finishTasks = (taskIds: string[], listId: number, q: string) =>
  request(`/list/tasks${q}`, Method.Put, { taskIds, listId });

export const unfinishTasks = (taskIds: string[], listId: number, q: string) =>
  request(`/list/tasks${q}`, Method.Delete, { taskIds, listId });

export const deleteTask = (taskId: string, listId: number, q: string) =>
  request(`/list/task${q}&taskId=${taskId}&listId=${listId}`, Method.Delete);

export const putEditTask = (data: EditTaskModel, q: string) =>
  request(`/list/task${q}`, Method.Put, data);
