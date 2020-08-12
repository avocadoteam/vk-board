import { AppState, ClientTheme, MainView } from 'core/models';
import { createSelector } from 'reselect';
import { RouterState } from 'connected-react-router';

export const getStateUi = (state: AppState) => state.ui;
export const getStateRouter = (state: AppState) => state.router ?? ({} as RouterState);

export const getTheme = createSelector(getStateUi, (ui) => ui.theme);

export const isThemeDrak = createSelector(getTheme, (theme) => theme === ClientTheme.Dark);

export const isAppUser = createSelector(getStateUi, (ui) => ui.isAppUser);

export const getActiveMainView = createSelector(getStateUi, (ui) => {
  if (!ui.online) {
    return MainView.Offline;
  }

  return MainView.Board;
});

export const getActiveModal = createSelector(getStateUi, (ui) => ui.activeModal);
