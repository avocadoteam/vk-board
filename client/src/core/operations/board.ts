import { request, Method } from './common';
import { NewTaskModel } from 'core/models';

export const getBoard = (q: string) => request(`/board${q}`, Method.Get);

export const postNewTask = (data: NewTaskModel, q: string) =>
  request(`/board/task${q}`, Method.Post, data);

export const getTasks = (listId: number, q: string) =>
  request(`/list/tasks${q}&listId=${listId}`, Method.Get);
