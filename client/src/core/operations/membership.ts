import { Method, request } from './common';

export const dropMembership = (userId: number, listId: number, q: string) =>
  request(`/list/membership${q}`, Method.Delete, {
    userId,
    listId,
  });

export const createMembership = (listId: number, q: string) =>
  request(`/list/membership${q}`, Method.Post, {
    listId,
  });

export const listMembershipPreview = (guid: string, q: string) =>
  request(`/list/membership${q}&guid=${guid}`, Method.Get);
