import { Method, request } from './common';

export const deletBoardList = (listId: number, q: string) => 
  request(`/list${q}&listId=${listId}`, Method.Delete);
