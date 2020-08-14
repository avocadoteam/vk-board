import { request, Method } from './common';

export const getBoard = (q: string) => request(`/board${q}`, Method.Get);
