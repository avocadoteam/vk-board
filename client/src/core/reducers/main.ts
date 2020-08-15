import * as models from 'core/models';
import { FetchingStatus, ClientTheme, ActiveModal } from 'core/models';

const hashValue = window.location.hash ? Number(window.location.hash.split('#').pop()) : null;

export const initialState: models.AppState['ui'] = {
  theme: ClientTheme.Light,
  fetchingDatas: {},
  notifications: false,
  appId: 7511650,
  hash: !hashValue || isNaN(hashValue) ? null : hashValue,
  online: true,
  initialQuery: '',
  isAppUser: true,
  onlineHandleActivate: true,
  activeModal: null,
  board: {
    selectedBoardListId: 12,
    newTask: {
      description: '',
      dueDate: '',
      name: '',
    },
    tasksToBeFinished: [],
    selectedTask: {
      id: 0,
      name: '',
      description: '',
      dueDate: '',
      taskGUID: '',
    },
  },
};

export const reducer = (
  state = initialState,
  dispatch: models.AppDispatch
): models.AppState['ui'] => {
  switch (dispatch.type) {
    case 'SET_THEME': {
      return {
        ...state,
        theme: dispatch.payload,
      };
    }
    case 'SET_UPDATING_DATA': {
      return {
        ...state,
        fetchingDatas: {
          ...state.fetchingDatas,
          [dispatch.payload]: {
            ...(state.fetchingDatas[dispatch.payload] ?? {}),
            status: FetchingStatus.Updating,
          },
        },
      };
    }
    case 'SET_READY_DATA': {
      return {
        ...state,
        fetchingDatas: {
          ...state.fetchingDatas,
          [dispatch.payload.name]: {
            ...(state.fetchingDatas[dispatch.payload.name] ?? {}),
            status: FetchingStatus.Ready,
            data: dispatch.payload.data,
          },
        },
      };
    }
    case 'SET_ERROR_DATA': {
      return {
        ...state,
        fetchingDatas: {
          ...state.fetchingDatas,
          [dispatch.payload.name]: {
            ...(state.fetchingDatas[dispatch.payload.name] ?? {}),
            status: FetchingStatus.Error,
            error: dispatch.payload.error,
          },
        },
      };
    }

    case 'SET_NOTIFICATIONS': {
      return {
        ...state,
        notifications: dispatch.payload,
      };
    }
    case 'SET_APPID': {
      return {
        ...state,
        appId: dispatch.payload,
      };
    }
    case 'SET_HASH': {
      return {
        ...state,
        hash: dispatch.payload,
      };
    }
    case 'SET_APP_CONNECT': {
      return {
        ...state,
        online: dispatch.payload,
      };
    }
    case 'SET_INIT_QUERY': {
      return {
        ...state,
        initialQuery: dispatch.payload,
      };
    }
    case 'SET_APP_USER': {
      return {
        ...state,
        isAppUser: dispatch.payload,
      };
    }

    case 'HANDLE_ACTIVATE_INIT': {
      return {
        ...state,
        onlineHandleActivate: dispatch.payload,
      };
    }

    case 'SET_MODAL': {
      return {
        ...state,
        activeModal: dispatch.payload,
      };
    }
    case 'SELECT_BOARD_LIST': {
      return {
        ...state,
        board: {
          ...state.board,
          selectedBoardListId: dispatch.payload,
        },
      };
    }
    case 'UPDATE_NEW_TASK': {
      return {
        ...state,
        board: {
          ...state.board,
          newTask: {
            ...state.board.newTask,
            [dispatch.payload.name]: dispatch.payload.value,
          },
        },
      };
    }
    case 'FINISH_TASK': {
      return {
        ...state,
        board: {
          ...state.board,
          tasksToBeFinished: [...state.board.tasksToBeFinished, dispatch.payload],
        },
      };
    }
    case 'REMOVE_FINISH_TASK': {
      return {
        ...state,
        board: {
          ...state.board,
          tasksToBeFinished: state.board.tasksToBeFinished.filter(
            (tId) => tId !== dispatch.payload
          ),
        },
      };
    }
    case 'SELECT_TASK': {
      return {
        ...state,
        board: {
          ...state.board,
          selectedTask: dispatch.payload,
        },
        activeModal: ActiveModal.SelectedTask
      };
    }

    default: {
      return state;
    }
  }
};
