import { NewTaskModel } from 'core/models';
import { request, Method } from './common';

export const postNewTask = (data: NewTaskModel, q: string) =>
  request(`/board/task${q}`, Method.Post, data);

export const getTasks = (listId: number, q: string) =>
  request(`/list/tasks${q}&listId=${listId}`, Method.Get);

export const finishTasks = (taskIds: number[], q: string) =>
  request(`/list/tasks${q}`, Method.Put, { taskIds });

export const deleteTask = (taskId: number, q: string) =>
  request(`/list/task${q}&taskId=${taskId}`, Method.Delete);
