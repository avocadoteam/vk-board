import io from 'socket.io-client';
import { initCallbacks } from './callbacks';
import { store } from 'core/store';
import { selectedBoardListInfo } from 'core/selectors/boardLists';
import { getUserId } from 'core/selectors/user';
import { FetchingStateName, isDev } from 'core/models';

const listNs = isDev ? '/selectedList' : 'https://stuffvk.app-dich.com/selectedList';

let selectedListConnected = false;

let socket: SocketIOClient.Socket;

export const connectListSocket = (query: string) => {
  console.debug('list connecting');
  if (selectedListConnected) return;
  socket = io(listNs, { query: query.replace(/\?vk_/g, 'vk_') });

  socket.on('connect', () => {
    console.debug('list ws connected');
    initCallbacks(socket);
    selectedListConnected = true;
    const state = store.getState();

    const { listguid } = selectedBoardListInfo(state);
    const userId = getUserId(state);
    joinRoom(userId, listguid);
    store.dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.PaymentInfo });

  });
  socket.on('disconnect', () => {
    console.debug('list ws disconnected');
    selectedListConnected = false;
  });
};

export const joinRoom = (userId: number, listGUID?: string) => {
  socket.emit('joinRoom', { listGUID, userId });
};
export const leaveRoom = (userId: number, listGUID?: string) => {
  socket.emit('leaveRoom', { listGUID, userId });
};
