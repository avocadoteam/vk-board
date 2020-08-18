import { createSelector } from 'reselect';
import { getStateUi, getBoardUiState } from './common';
import { FetchingStateName, FetchingDataType, FetchingStatus } from 'core/models';
import { getBoardListData, isBoardUpdating } from './board';
import { getUserId } from './user';

const getDropMembershipDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.DropMembership] ?? {}) as FetchingDataType<boolean>
);

export const isDropMembershipUpdating = createSelector(
  getDropMembershipDataState,
  isBoardUpdating,
  (dataState, boardUpdating) => dataState.status === FetchingStatus.Updating || boardUpdating
);

export const getMembershipList = createSelector(
  getBoardListData,
  getBoardUiState,
  getUserId,
  (data, { boardListOpenId }, userId) =>
    (data.find((d) => d.id === boardListOpenId)?.memberships ?? []).filter(
      (m) => m.userId !== userId
    )
);
