import { safeCombineEpics } from './combine';
import { AppEpic, FetchingStateName, AppDispatch, FetchResponse } from 'core/models';
import { ofType } from 'redux-observable';
import { filter, switchMap, map } from 'rxjs/operators';
import { from, of, concat, empty } from 'rxjs';
import { buyPremium } from 'core/vk-bridge/user';
import { devTimeout } from './addons';
import { captureFetchErrorWithTaptic, captureFetchError } from './errors';
import { paymentInfo, lastGoogleSyncInfo } from 'core/operations/payment';
import { getSearch } from 'connected-react-router';

const userMakePaymentEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SET_UPDATING_DATA'),
    filter(({ payload }) => payload === FetchingStateName.PaymentProccess),
    switchMap(() =>
      from(buyPremium()).pipe(
        devTimeout(),
        switchMap((pr) => {
          if ('result' in pr) {
            if (!pr.result.status) {
              throw new Error(`Платеж не завершен`);
            }
          } else if (!pr.status) {
            throw new Error(`Платеж не завершен`);
          }
          return empty();
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
