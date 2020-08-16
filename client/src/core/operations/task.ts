import { NewTaskModel } from 'core/models';
import { request, Method } from './common';

export const postNewTask = (data: NewTaskModel, q: string) =>
  request(`/board/task${q}`, Method.Post, data);

export const getTasks = (listId: number, q: string) =>
  request(`/list/tasks${q}&listId=${listId}`, Method.Get);

export const finishTasks = (taskIds: number[], listId: number, q: string) =>
  request(`/list/tasks${q}`, Method.Put, { taskIds, listId });

export const deleteTask = (taskId: number, listId: number, q: string) =>
  request(`/list/task${q}&taskId=${taskId}&listId=${listId}`, Method.Delete);
