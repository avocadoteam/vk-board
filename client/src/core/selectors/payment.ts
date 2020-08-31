import { createSelector } from 'reselect';
import { getStateUi } from './common';
import { FetchingStateName, FetchingDataType, FetchingStatus } from 'core/models';

const getPaymentInfoDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.PaymentInfo] ?? {}) as FetchingDataType<boolean>
);
const getPaymentProccessDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.PaymentProccess] ?? {}) as FetchingDataType<boolean>
);

const getLastGoogleSyncProccessDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.LastGoogleSync] ?? {}) as FetchingDataType<number>
);

export const isPaymentUpdating = createSelector(
  getPaymentInfoDataState,
  getPaymentProccessDataState,
  (info, proccess) =>
    info.status === FetchingStatus.Updating || proccess.status === FetchingStatus.Updating
);

export const hasUserPremium = createSelector(
  getPaymentInfoDataState,
  (dataState) => dataState.data ?? false
);

export const getLastGoogleSyncHrs = createSelector(
  getLastGoogleSyncProccessDataState,
  (dataState) => dataState.data ?? 24
);

export const isLastGoogleSyncUpdating = createSelector(
  getLastGoogleSyncProccessDataState,
  (info) => info.status === FetchingStatus.Updating
);
