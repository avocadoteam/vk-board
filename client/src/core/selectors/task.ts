import { createSelector } from 'reselect';
import { FetchingStateName, FetchingDataType, FetchingStatus } from 'core/models';
import { getStateUi } from './common';

const getTaskDeleteDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.DeleteTask] ?? {}) as FetchingDataType<boolean>
);

export const isTaskDeleteUpdating = createSelector(
  getTaskDeleteDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);
