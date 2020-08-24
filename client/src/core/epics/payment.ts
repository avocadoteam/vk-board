import { safeCombineEpics } from './combine';
import { AppEpic, FetchingStateName, AppDispatch, premiumPrice, FetchResponse } from 'core/models';
import { ofType } from 'redux-observable';
import { filter, switchMap, map } from 'rxjs/operators';
import { from, of, concat } from 'rxjs';
import { buyPremium } from 'core/vk-bridge/user';
import { devTimeout } from './addons';
import { captureFetchErrorWithTaptic, captureFetchError } from './errors';
import { createPayment, paymentInfo, lastGoogleSyncInfo } from 'core/operations/payment';
import { getQToQuery } from 'core/selectors/user';
import { getSearch } from 'connected-react-router';

const userMakePaymentEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.PaymentProccess),
    switchMap(() =>
      from(buyPremium()).pipe(
        devTimeout(),
        switchMap((pr) => {
          console.log(pr);
          let amount = '';
          if ('result' in pr) {
            if (pr.result.status && pr.result.amount === premiumPrice.toString()) {
              amount = pr.result.amount;
            }
            if (!pr.result.status) {
              throw new Error(`Платеж не завершен`);
            }
            if (pr.result.amount !== premiumPrice.toString()) {
              amount = pr.result.amount;
            }
          } else {
            if (pr.status && pr.amount === premiumPrice.toString()) {
              amount = pr.amount;
            }
            if (!pr.status) {
              throw new Error(`Платеж не завершен`);
            }
            if (pr.amount !== premiumPrice.toString()) {
              amount = pr.amount;
            }
          }
          const q = getQToQuery(state$.value);
          return createPayment(amount, q).pipe(
            switchMap((response) => {
              if (response.ok) {
                return concat(
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.PaymentProccess,
                      data: true,
                    },
                  } as AppDispatch),
                  of({
                    type: 'SET_UPDATING_DATA',
                    payload: FetchingStateName.PaymentInfo,
                  } as AppDispatch),
                  of({
                    type: 'SET_UPDATING_DATA',
                    payload: FetchingStateName.LastGoogleSync,
                  } as AppDispatch)
                );
              } else {
                throw new Error(`Http ${response.status} on ${response.url}`);
              }
            }),
            captureFetchErrorWithTaptic(
              FetchingStateName.PaymentProccess,
              'Не удалось произвести покупку премиума'
            )
          );
        }),
        captureFetchErrorWithTaptic(
          FetchingStateName.PaymentProccess,
          'Не удалось произвести покупку премиума'
        )
      )
    )
  );

const ensurePaymentEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.PaymentInfo),
    map(() => ({
      q: getSearch(state$.value),
    })),
    switchMap(({ q }) =>
      paymentInfo(q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return from(response.json() as Promise<FetchResponse<boolean>>).pipe(
              switchMap((r) => {
                if (r?.data) {
                  return concat(
                    of({
                      type: 'SET_READY_DATA',
                      payload: {
                        name: FetchingStateName.PaymentInfo,
                        data: r?.data,
                      },
                    } as AppDispatch),
                    of({
                      type: 'SET_UPDATING_DATA',
                      payload: FetchingStateName.LastGoogleSync,
                    } as AppDispatch)
                  );
                }

                return of({
                  type: 'SET_READY_DATA',
                  payload: {
                    name: FetchingStateName.PaymentInfo,
                    data: r?.data,
                  },
                } as AppDispatch);
              })
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchError(FetchingStateName.PaymentInfo)
      )
    )
  );
const lastGoogleSyncInfoEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.LastGoogleSync),
    map(() => ({
      q: getSearch(state$.value),
    })),
    switchMap(({ q }) =>
      lastGoogleSyncInfo(q).pipe(
        switchMap((response) => {
          if (response.ok) {
            return from(response.json() as Promise<FetchResponse<number>>).pipe(
              switchMap((r) => {
                return of({
                  type: 'SET_READY_DATA',
                  payload: {
                    name: FetchingStateName.LastGoogleSync,
                    data: r?.data ?? 24,
                  },
                } as AppDispatch);
              })
            );
          } else {
            throw new Error(`Http ${response.status} on ${response.url}`);
          }
        }),
        captureFetchError(FetchingStateName.LastGoogleSync)
      )
    )
  );

export const paymentEpics = safeCombineEpics(
  userMakePaymentEpic,
  ensurePaymentEpic,
  lastGoogleSyncInfoEpic
);
