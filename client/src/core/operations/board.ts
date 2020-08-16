import { request, Method } from './common';

export const getBoard = (q: string) => request(`/board${q}`, Method.Get);

export const newBoardList = (name: string, q: string) =>
  request(`/board/list${q}`, Method.Post, { name });
