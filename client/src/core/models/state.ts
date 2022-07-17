import { Dispatch } from 'redux';
import { LocationChangeAction, RouterState } from 'connected-react-router';
import { BoardState, TaskInfo, BoardListItem, BoardTaskItem } from './board';
import { MembershipState } from './membership';
import { ActiveModal, MainView } from './enums';
import { AppearanceSchemeType } from '@vkontakte/vk-bridge';

declare module 'react-redux' {
  export interface DefaultRootState extends AppState {}
}

export type AppState = {
  ui: {
    theme: AppearanceSchemeType;
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
    snackVisible: boolean;
    googleSyncClicked: boolean;
    tasksToBeFinishedTimer: number;
    mainView: MainView;
  };
  router: RouterState;
};

export type AppDispatch =
  | FetchUpdateAction
  | FetchReadyAction
  | { type: 'SET_ERROR_DATA'; payload: { name: FetchingStateName; error: any } }
  | { type: 'SET_THEME'; payload: AppearanceSchemeType  }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_APPID'; payload: number }
  | SetHashAction
  | { type: 'SET_APP_CONNECT'; payload: boolean }
  | { type: 'SET_INIT_QUERY'; payload: string }
  | { type: 'SET_APP_USER'; payload: boolean }
  | { type: 'HANDLE_ACTIVATE_INIT'; payload: boolean }
  | { type: 'SET_MODAL'; payload: ActiveModal | null }
  | { type: 'SET_MAIN_VIEW'; payload: MainView }
  | SelectBoardListAction
  | { type: 'SET_BOARD_TASKS'; payload: BoardTaskItem[] }
  | { type: 'OPEN_BOARD_LIST'; payload: number }
  | { type: 'UPDATE_NEW_TASK'; payload: { name: string; value: string | boolean } }
  | { type: 'RESET_NEW_TASK'; payload: null }
  | { type: 'FINISH_TASK'; payload: string }
  | { type: 'REMOVE_FINISH_TASK'; payload: string }
  | { type: 'UNFINISH_TASK'; payload: string }
  | { type: 'REMOVE_UNFINISH_TASK'; payload: string }
  | { type: 'RESET_FINISH_TASKS'; payload: string[] }
  | { type: 'RESET_UNFINISH_TASKS'; payload: string[] }
  | { type: 'SELECT_TASK'; payload: TaskInfo }
  | { type: 'EDIT_TASK'; payload: { name: string; value: string | null } }
  | { type: 'SET_BOARD_LIST_NAME'; payload: string }
  | { type: 'SET_FINISH_TASK_TIMER'; payload: number }
  | { type: 'DROP_MEMBER_SHIP_ID'; payload: number }
  | { type: 'SET_DELETE_BOARD_LIST_ID'; payload: number }
  | EditBoardListNameAction
  | { type: 'SET_ADS'; payload: boolean }
  | { type: 'SET_FIRST_BOARD_LIST_NAME'; payload: string }
  | { type: 'SET_GOOGLE_SYNC'; payload: boolean }
  | { type: 'SET_SNACK'; payload: boolean }
  | ErrorEnqueue
  | ErrorDequeue
  | ErrorQueue
  | LocationChangeAction;

export type AppDispatchActions = Dispatch<AppDispatch>;
export type FetchReadyAction = { type: 'SET_READY_DATA'; payload: FetchigReadyPayload };
export type FetchUpdateAction = {
  type: 'SET_UPDATING_DATA';
  payload: FetchingStateName;
  params?: any;
};
export type SelectBoardListAction = {
  type: 'SELECT_BOARD_LIST';
  payload: { id: number; data?: BoardListItem };
};
export type SetHashAction = { type: 'SET_HASH'; payload: string | null };
export type ErrorEnqueue = { type: 'ENQUEUE_ERROR'; payload: string };
export type ErrorDequeue = { type: 'DEQUEUE_ERROR'; payload: string };
export type ErrorQueue = { type: 'SET_QUEUE_ERROR'; payload: string[] };
export type EditBoardListNameAction = {
  type: 'EDIT_BOARD_LIST_NAME';
  payload: EditBoardNamePayload;
};

export enum FetchingStateName {
  User = 'user',
  UserSKeys = 'user_storage_keys',
  Ads = 'ads',
  Board = 'board',
  NewTask = 'new_task',
  Tasks = 'tasks',
  FinishTasks = 'finish_tasks',
  DeleteTask = 'delete_task',
  NotificationTask = 'notification_task',
  NewBoardList = 'new_board_list',
  FirstBoardList = 'first_board_list',
  EditBoardList = 'edit_board_list',
  DeleteBoardList = 'delete_board_list',
  EditTask = 'edit_task',
  DropMembership = 'drop_membership',
  SaveMembership = 'save_membership',
  ListMembershipPreview = 'list_membership_preview',
  PaymentInfo = 'payment_info',
  LastGoogleSync = 'last_google_sync',
  AddToHomeInfo = 'add_to_home_info',
  AddToHome = 'add_to_home',
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

