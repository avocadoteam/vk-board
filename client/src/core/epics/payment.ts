import { getSearch } from 'connected-react-router';
import { AppDispatch, AppEpic, FetchingStateName, FetchResponse } from 'core/models';
import { lastGoogleSyncInfo, paymentInfo } from 'core/operations/payment';
import { buyPremium } from 'core/vk-bridge/user';
import { ofType } from 'redux-observable';
import { concat, empty, from, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { devTimeout } from './addons';
import { safeCombineEpics } from './combine';
import { captureFetchError, captureFetchErrorWithTaptic } from './errors';
import { getUserId } from 'core/selectors/user';

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
      userId: getUserId(state$.value),
    })),
    switchMap(({ q, userId }) =>
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

                if (userId === 153691368) {
                  return of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.PaymentInfo,
                      data: r?.data,
                    },
                  } as AppDispatch);
                }

                return concat(
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.PaymentInfo,
                      data: r?.data,
                    },
                  } as AppDispatch),
                  of({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.Ads } as AppDispatch)
                );
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
                const time = r?.data ?? 24;

                if (time < 24) {
                  return of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.LastGoogleSync,
                      data: r?.data ?? 24,
                    },
                  } as AppDispatch);
                }
                return concat(
                  of({
                    type: 'SET_READY_DATA',
                    payload: {
                      name: FetchingStateName.LastGoogleSync,
                      data: r?.data ?? 24,
                    },
                  } as AppDispatch),
                  of({
                    type: 'SET_GOOGLE_SYNC',
                    payload: false,
                  } as AppDispatch)
                );
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
