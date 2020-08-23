import { Method, request } from './common';

export const createPayment = (amount: string, q: string) =>
  request(`/payment${q}`, Method.Post, {
    amount,
  });
export const paymentInfo = (q: string) => request(`/payment${q}`, Method.Get);
export const lastGoogleSyncInfo = (q: string) => request(`/payment/gSync${q}`, Method.Get);
