import { Dispatch } from 'redux';
import { LocationChangeAction, RouterState } from 'connected-react-router';
import { BoardState, TaskInfo, BoardListItem, BoardTaskItem } from './board';
import { MembershipState } from './membership';
import { ActiveModal } from './enums';

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
    hashListGUID: string | null;
    online: boolean;
    onlineHandleActivate: boolean;
    initialQuery: string;
    isAppUser: boolean;
    activeModal: ActiveModal | null;
    board: BoardState;
    membership: MembershipState;
    showAds: boolean;
    errorsQueue: string[];
    googleSyncProccess: boolean;
  };
  router: RouterState;
};

export type AppDispatch =
  | FetchUpdateAction
  | FetchReadyAction
  | { type: 'SET_ERROR_DATA'; payload: { name: FetchingStateName; error: any } }
  | { type: 'SET_THEME'; payload: ClientTheme }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_APPID'; payload: number }
  | SetHashAction
  | { type: 'SET_APP_CONNECT'; payload: boolean }
  | { type: 'SET_INIT_QUERY'; payload: string }
  | { type: 'SET_APP_USER'; payload: boolean }
  | { type: 'HANDLE_ACTIVATE_INIT'; payload: boolean }
  | { type: 'SET_MODAL'; payload: ActiveModal | null }
  | SelectBoardListAction
  | { type: 'SET_BOARD_TASKS'; payload: BoardTaskItem[] }
  | { type: 'OPEN_BOARD_LIST'; payload: number }
  | { type: 'UPDATE_NEW_TASK'; payload: { name: string; value: string } }
  | { type: 'RESET_NEW_TASK'; payload: null }
  | { type: 'FINISH_TASK'; payload: number }
  | { type: 'REMOVE_FINISH_TASK'; payload: number }
  | { type: 'UNFINISH_TASK'; payload: number }
  | { type: 'REMOVE_UNFINISH_TASK'; payload: number }
  | { type: 'RESET_FINISH_TASKS'; payload: number[] }
  | { type: 'RESET_UNFINISH_TASKS'; payload: number[] }
  | { type: 'SELECT_TASK'; payload: TaskInfo }
  | { type: 'EDIT_TASK'; payload: { name: string; value: string | null } }
  | { type: 'SET_BOARD_LIST_NAME'; payload: string }
  | { type: 'SET_FINISH_TASK_TIMER'; payload: number }
  | { type: 'DROP_MEMBER_SHIP_ID'; payload: number }
  | { type: 'SET_DELETE_BOARD_LIST_ID'; payload: number }
  | { type: 'EDIT_BOARD_LIST_NAME'; payload: EditBoardNamePayload }
  | { type: 'SET_ADS'; payload: boolean }
  | { type: 'SET_FIRST_BOARD_LIST_NAME'; payload: string }
  | { type: 'SET_GOOGLE_SYNC'; payload: boolean }
  | ErrorEnqueue
  | ErrorDequeue
  | LocationChangeAction;

export type AppDispatchActions = Dispatch<AppDispatch>;
export type FetchReadyAction = { type: 'SET_READY_DATA'; payload: FetchigReadyPayload };
export type FetchUpdateAction = { type: 'SET_UPDATING_DATA'; payload: FetchingStateName };
export type SelectBoardListAction = {
  type: 'SELECT_BOARD_LIST';
  payload: { id: number; data?: BoardListItem };
};
export type SetHashAction = { type: 'SET_HASH'; payload: string | null };
export type ErrorEnqueue = { type: 'ENQUEUE_ERROR'; payload: string };
export type ErrorDequeue = { type: 'DEQUEUE_ERROR'; payload: string };

export enum FetchingStateName {
  User = 'user',
  UserSKeys = 'user_storage_keys',
  Ads = 'ads',
  Board = 'board',
  NewTask = 'new_task',
  Tasks = 'tasks',
  FinishTasks = 'finish_tasks',
  DeleteTask = 'delete_task',
  NewBoardList = 'new_board_list',
  FirstBoardList = 'first_board_list',
  EditBoardList = 'edit_board_list',
  DeleteBoardList = 'delete_board_list',
  EditTask = 'edit_task',
  DropMembership = 'drop_membership',
  SaveMembership = 'save_membership',
  ListMembershipPreview = 'list_membership_preview',
  PaymentProccess = 'payment_proccess',
  PaymentInfo = 'payment_info',
  LastGoogleSync = 'last_google_sync'
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
export type EditBoardNamePayload = { name: string; id?: number };

export enum ClientTheme {
  /**
   * @deprecated
   */
  oldLight = 'client_light',
  Light = 'bright_light',
  Dark = 'space_gray',
}
