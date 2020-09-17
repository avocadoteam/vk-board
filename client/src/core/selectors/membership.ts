import { createSelector } from 'reselect';
import { getStateUi, getBoardUiState, getMembershipUiState } from './common';
import {
  FetchingStateName,
  FetchingDataType,
  FetchingStatus,
  MembershipListPreview,
} from 'core/models';
import { getBoardListData, isBoardUpdating } from './board';
import { getUserId } from './user';

const getDropMembershipDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.DropMembership] ?? {}) as FetchingDataType<boolean>
);

const getPreviewMembershipDataState = createSelector(
  getStateUi,
  (ui) =>
    (ui.fetchingDatas[FetchingStateName.ListMembershipPreview] ?? {}) as FetchingDataType<
      MembershipListPreview
    >
);

const getSaveMembershipDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.SaveMembership] ?? {}) as FetchingDataType<boolean>
);

export const isDropMembershipUpdating = createSelector(
  getDropMembershipDataState,
  isBoardUpdating,
  (dataState, boardUpdating) => dataState.status === FetchingStatus.Updating || boardUpdating
);

export const getPreviewMembershipData = createSelector(
  getPreviewMembershipDataState,
  (dataState) => dataState.data ?? { id: 0, name: '' }
);

export const isSaveMembershipUpdating = createSelector(
  getSaveMembershipDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);
export const isSaveMembershipReady = createSelector(
  getSaveMembershipDataState,
  (dataState) => dataState.status === FetchingStatus.Ready
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

export const getUserFirstNameToDelete = createSelector(
  getMembershipList,
  getMembershipUiState,
  (list, { dropUserId }) => list.find(ml => ml.userId === dropUserId)?.firstName
)
