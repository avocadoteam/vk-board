import { createSelector } from 'reselect';
import { getStateUi } from './common';
import { getLocationMainPath, getLocationSubPath } from './router';
import { MainView, ActiveModal, WelcomeView, isDev } from 'core/models';
import { isPlatformIOS } from './settings';

export const getActiveMainView = createSelector(getStateUi, getLocationMainPath, (ui, mainPath) => {
  if (!ui.online) {
    return MainView.Offline;
  }

  if (!isDev && !ui.isAppUser) {
    return MainView.Welcome;
  }

  if (isPlatformIOS()) {
    return ui.mainView;
  }

  if (mainPath === null) {
    return MainView.Board;
  }

  switch (mainPath) {
    case MainView.ListMembership:
      return MainView.ListMembership;
    case MainView.ListSharePreview:
      return MainView.ListSharePreview;
    case MainView.About:
      return MainView.About;

    default:
      return MainView.Board;
  }
});

export const getActiveModalRoute = createSelector(
  getActiveMainView,
  getLocationSubPath,
  getStateUi,
  (mainView, subPath, ui) => {
    if (mainView !== MainView.Board && mainView !== MainView.ListMembership) {
      return null;
    }

    if (isPlatformIOS()) {
      return ui.activeModal;
    }

    switch (subPath) {
      case ActiveModal.NewTask:
        return ActiveModal.NewTask;
      case ActiveModal.SelectedTask:
        return ActiveModal.SelectedTask;
      case ActiveModal.Lists:
        return ActiveModal.Lists;
      case ActiveModal.DropMembership:
        return ActiveModal.DropMembership;
      case ActiveModal.DeleteList:
        return ActiveModal.DeleteList;
      case ActiveModal.DeleteTask:
        return ActiveModal.DeleteTask;
      case ActiveModal.EditTask:
        return ActiveModal.EditTask;

      default:
        return null;
    }
  }
);

export const getWelcomeView = createSelector(getLocationSubPath, (subPath) => {
  switch (subPath) {
    case WelcomeView.Greetings:
      return WelcomeView.Greetings;
    case WelcomeView.TaskCreation:
      return WelcomeView.TaskCreation;
    default:
      return WelcomeView.Greetings;
  }
});
