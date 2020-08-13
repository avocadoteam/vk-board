import { Dispatch } from 'redux';
import { LocationChangeAction, RouterState } from 'connected-react-router';
import { BoardState } from './board';

declare module 'react-redux' {
  export interface DefaultRootState extends AppState {}
}

export type AppState = {
  ui: {
    theme: ClientTheme;
    fetchingDatas: {
      [key in FetchingStateName]?: {
        status: FetchingStatus;
        data: any;
        error: any;
      };
    };
    notifications: boolean;
    appId: number;
    hash: number | null;
    online: boolean;
    onlineHandleActivate: boolean;
    initialQuery: string;
    isAppUser: boolean;
    activeModal: ActiveModal | null;
    board: BoardState;
  };
  router: RouterState;
};

export type AppDispatch =
  | {
      type: 'SET_UPDATING_DATA';
      payload: FetchingStateName;
    }
  | { type: 'SET_READY_DATA'; payload: FetchigReadyPayload }
  | { type: 'SET_ERROR_DATA'; payload: { name: FetchingStateName; error: any } }
  | { type: 'SET_THEME'; payload: ClientTheme }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_APPID'; payload: number }
  | { type: 'SET_HASH'; payload: number | null }
  | { type: 'SET_APP_CONNECT'; payload: boolean }
  | { type: 'SET_INIT_QUERY'; payload: string }
  | { type: 'SET_APP_USER'; payload: boolean }
  | { type: 'HANDLE_ACTIVATE_INIT'; payload: boolean }
  | { type: 'SET_MODAL'; payload: ActiveModal | null }
  | { type: 'SELECT_BOARD_LIST'; payload: number }
  | { type: 'UPDATE_NEW_TASK'; payload: { name: string; value: string } }
  | LocationChangeAction;

export type AppDispatchActions = Dispatch<AppDispatch>;

export enum AppUser {
  Yes = 'yes',
  No = 'no',
}

export enum ActiveModal {
  SelectedTask = 'selectedtask',
  Lists = 'lists',
  NewTask = 'newtask',
}

export enum FetchingStateName {
  User = 'user',
  Ads = 'ads',
  Board = 'board',
  NewTask = 'new_task',
  Tasks = 'tasks',
}

export enum FetchingStatus {
  Updating = 1,
  Ready,
  Error,
}

export type FetchingDataType<T> = {
  status: FetchingStatus;
  data: T;
  error: any;
};

export type FetchResponse<T> = {
  data: T;
};

export type FetchigReadyPayload = { name: FetchingStateName; data: any };

export enum ClientTheme {
  oldLight = 'client_light',
  Light = 'bright_light',
  Dark = 'space_gray',
}
