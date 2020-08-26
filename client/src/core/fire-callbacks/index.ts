import { client } from 'core/callbacks';
import { store } from 'core/store';
import { FetchingStateName, BoardTaskItem, ListUpdatedType, BoardListItem } from 'core/models';
import {
  getSelectedListTasks,
  getSelectedList,
  selectedBoardListInfo,
} from 'core/selectors/boardLists';
import { sortByCreated } from 'core/utils';
import { getBoardListData } from 'core/selectors/board';

client.new_task = (task) => {
  const currTasks = getSelectedListTasks(store.getState());
  store.dispatch({
    type: 'SET_BOARD_TASKS',
    payload: [task, ...currTasks],
  });
};

client.finish_tasks = ({ taskIds }) => {
  const now = new Date().toString();
  const { tasks } = getSelectedList(store.getState());
  const [finishedTasks, notFinishedTasks] = tasks.reduce(
    (acc, task) => {
      const [f, n] = acc;
      if (taskIds.includes(task.id) || task.finished) {
        return [f.concat({ ...task, finished: now }), n];
      }
      return [f, n.concat(task)];
    },
    [[], []] as [BoardTaskItem[], BoardTaskItem[]]
  );
  store.dispatch({
    type: 'SET_BOARD_TASKS',
    payload: notFinishedTasks.concat(finishedTasks),
  });
};
client.unfinish_tasks = ({ taskIds }) => {
  const { tasks } = getSelectedList(store.getState());
  const [finishedTasks, notFinishedTasks] = tasks.reduce(
    (acc, task) => {
      const [f, n] = acc;
      if (taskIds.includes(task.id)) {
        return [f, n.concat({ ...task, finished: null })];
      }
      if (task.finished) {
        return [f.concat(task), n];
      }
      return [f, n.concat(task)];
    },
    [[], []] as [BoardTaskItem[], BoardTaskItem[]]
  );
  store.dispatch({
    type: 'SET_BOARD_TASKS',
    payload: notFinishedTasks.concat(finishedTasks).sort(sortByCreated),
  });
};

client.update_task = (updatedTask) => {
  const tasks = getSelectedListTasks(store.getState());
  const updatedTasks = tasks.reduce((acc, task) => {
    if (task.id === updatedTask.id) {
      return acc.concat({ ...task, ...updatedTask });
    }
    return acc.concat(task);
  }, [] as BoardTaskItem[]);
  store.dispatch({
    type: 'SET_BOARD_TASKS',
    payload: updatedTasks,
  });
};
client.delete_task = (taskId) => {
  const currentTasks = getSelectedListTasks(store.getState());
  store.dispatch({
    type: 'SET_BOARD_TASKS',
    payload: currentTasks.filter((t) => t.id !== `${taskId}`),
  });
};

client.stop_g_sync = () => {
  console.warn('stop_g_sync');
  store.dispatch({ type: 'SET_GOOGLE_SYNC', payload: false });
};
client.payment_complete = () => {
  console.warn('payment_complete');
  store.dispatch({
    type: 'SET_READY_DATA',
    payload: {
      name: FetchingStateName.PaymentProccess,
      data: true,
    },
  });
  store.dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.PaymentInfo });
  store.dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.LastGoogleSync });
};

client.list_updated = ({ updatedType, listGUID, name, member }) => {
  const state = store.getState();
  const boardLists = getBoardListData(state);

  switch (updatedType) {
    case ListUpdatedType.Name: {
      const info = selectedBoardListInfo(state);

      if (!name) {
        break;
      }

      store.dispatch({
        type: 'SELECT_BOARD_LIST',
        payload: {
          id: info.id,
          data: {
            ...info,
            name,
          },
        },
      });

      const newBoardLists = boardLists.reduce((acc, list) => {
        if (list.listguid === listGUID) {
          return acc.concat({
            ...list,
            name,
          });
        }

        return acc.concat(list);
      }, [] as BoardListItem[]);

      store.dispatch({
        type: 'SET_READY_DATA',
        payload: {
          name: FetchingStateName.Board,
          data: newBoardLists,
        },
      });
      break;
    }
    case ListUpdatedType.Deleted:
      const firstAvailList = boardLists.filter((l) => l.listguid !== listGUID)[0];
      if (!firstAvailList) {
        break;
      }

      store.dispatch({
        type: 'SELECT_BOARD_LIST',
        payload: {
          id: firstAvailList.id,
          data: firstAvailList,
        },
      });

      const newBoardLists = boardLists.reduce((acc, list) => {
        if (list.listguid === listGUID) {
          return acc;
        }

        return acc.concat(list);
      }, [] as BoardListItem[]);

      store.dispatch({
        type: 'SET_READY_DATA',
        payload: {
          name: FetchingStateName.Board,
          data: newBoardLists,
        },
      });
      break;
    case ListUpdatedType.AddMember: {
      if (!member) {
        break;
      }
      const boardLists = getBoardListData(state);

      const newBoardLists = boardLists.reduce((acc, list) => {
        if (list.listguid === listGUID) {
          return acc.concat({
            ...list,
            memberships: list.memberships.concat(member),
          });
        }

        return acc.concat(list);
      }, [] as BoardListItem[]);

      store.dispatch({
        type: 'SET_READY_DATA',
        payload: {
          name: FetchingStateName.Board,
          data: newBoardLists,
        },
      });

      break;
    }

    case ListUpdatedType.DropMember: {
      if (!member) {
        break;
      }
      const boardLists = getBoardListData(state);
      const newBoardLists = boardLists.reduce((acc, list) => {
        if (list.listguid === listGUID) {
          return acc.concat({
            ...list,
            memberships: list.memberships.filter((m) => m.userId !== member.userId),
          });
        }

        return acc.concat(list);
      }, [] as BoardListItem[]);

      store.dispatch({
        type: 'SET_READY_DATA',
        payload: {
          name: FetchingStateName.Board,
          data: newBoardLists,
        },
      });
    }

    default:
      break;
  }
};
