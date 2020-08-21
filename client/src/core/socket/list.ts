import io from 'socket.io-client';
import { initCallbacks } from './callbacks';

const listNs = '/selectedList';

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
  });
  socket.on('disconnect', () => {
    console.debug('list ws disconnected');
    selectedListConnected = false;
  });
};

export const joinRoom = (listGUID: string) => {
  socket.emit('joinRoom', listGUID);
};
export const leaveRoom = (listGUID: string) => {
  socket.emit('leaveRoom', listGUID);
};
