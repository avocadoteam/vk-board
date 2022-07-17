import { RouterState } from 'connected-react-router';
import { AppState } from 'core/models';
import { createSelector } from 'reselect';

export const getStateUi = (state: AppState) => state.ui;
export const getStateRouter = (state: AppState) => state.router ?? ({} as RouterState);

export const getTheme = createSelector(getStateUi, (ui) => ui.theme);

export const isThemeDrak = createSelector(getTheme, (theme) => theme === 'space_gray' || theme === 'vkcom_dark');

export const isAppUser = createSelector(getStateUi, (ui) => ui.isAppUser);

export const getActiveModal = createSelector(getStateUi, (ui) => ui.activeModal);

export const getBoardUiState = createSelector(getStateUi, (ui) => ui.board);
export const getBoardUiStateTimer = createSelector(getStateUi, (ui) => ui.tasksToBeFinishedTimer);
export const getMembershipUiState = createSelector(getStateUi, (ui) => ui.membership);

export const isAdsShown = createSelector(getStateUi, (ui) => ui.showAds);
