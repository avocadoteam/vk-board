export enum MainView {
  Board = 'board',
  Welcome = 'welcome',
  Offline = 'offline',
  ListMembership = 'listMembership',
  About = 'about',
  ListSharePreview = 'listSharePreview',
  LoadingGeneralInfo = 'loading',
}
export enum WelcomeView {
  Greetings = 'greetings',
  TaskCreation = 'taskCreation',
}

export enum Skeys {
  appUser = 'appUser',
  userSelectedListId = 'userSelectedListId',
}

export enum AppUser {
  Yes = 'yes',
  No = 'no',
}

export enum ActiveModal {
  SelectedTask = 'selectedtask',
  Lists = 'lists',
  NewTask = 'newtask',
  DropMembership = 'dropmembership',
  DeletList = 'deletelist',
}

export const activeModals = [
  ActiveModal.DeletList,
  ActiveModal.DropMembership,
  ActiveModal.Lists,
  ActiveModal.NewTask,
  ActiveModal.SelectedTask,
];
