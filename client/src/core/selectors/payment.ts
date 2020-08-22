import { createSelector } from 'reselect';
import { getStateUi } from './common';
import { FetchingStateName, FetchingDataType, FetchingStatus, payToUserId } from 'core/models';
import { getUserId } from './user';

const getPaymentInfoDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.PaymentInfo] ?? {}) as FetchingDataType<boolean>
);
const getPaymentProccessDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.PaymentProccess] ?? {}) as FetchingDataType<boolean>
);

export const isPaymentUpdating = createSelector(
  getPaymentInfoDataState,
  getPaymentProccessDataState,
  (info, proccess) =>
    info.status === FetchingStatus.Updating || proccess.status === FetchingStatus.Updating
);

export const hasUserPremium = createSelector(
  getPaymentInfoDataState,
  getUserId,
  (dataState, userId) => dataState.data ?? (false || userId === payToUserId)
);
