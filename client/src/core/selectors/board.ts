import { createSelector } from 'reselect';
import { getStateUi } from './common';
import { FetchingStateName, FetchingDataType, BoardListIiem, FetchingStatus } from 'core/models';

const getBoardListsDataState = createSelector(
  getStateUi,
  (ui) => (ui.fetchingDatas[FetchingStateName.Board] ?? {}) as FetchingDataType<BoardListIiem[]>
);

export const isBoardUpdating = createSelector(
  getBoardListsDataState,
  (dataState) => dataState.status === FetchingStatus.Updating
);

export const getBoardListData = createSelector(
  getBoardListsDataState,
  (dataState) => dataState.data ?? []
);

export const getBoardLists = createSelector(getBoardListData, (data) =>
  data.map((d) => ({
    name: d.name,
    id: d.id,
  }))
);

export const selectedBoardListInfo = createSelector(
  getStateUi,
  getBoardListData,
  (ui, data): BoardListIiem =>
    data.find((bl) => bl.id === ui.board.selectedBoardListId) ?? {
      id: 0,
      created: '',
      name: '',
      tasks: [],
    }
);
