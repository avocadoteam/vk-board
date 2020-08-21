import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NameSpaces, SocketEvents, BusEvents } from 'src/contracts/enum';
import { EventBus } from './events.bus';
import { Inject } from '@nestjs/common';
import * as qs from 'querystring';
import * as crypto from 'crypto';
import integrationConfig from 'src/config/integration.config';
import { ConfigType } from '@nestjs/config';
import { RedisAdapter } from 'socket.io-redis';

@WebSocketGateway({ namespace: NameSpaces.SelctedList })
export class EventsGateway implements OnGatewayInit {
  constructor(
    @Inject(integrationConfig.KEY)
    private config: ConfigType<typeof integrationConfig>,
  ) {}

  @WebSocketServer()
  server!: Server;

  afterInit(initServer: Server) {
    initServer.use((socket, next) => {
      const query = socket.handshake.query;

      const ordered: { [key: string]: any } = {};
      Object.keys(query)
        .sort()
        .forEach((key) => {
          if (key.slice(0, 3) === 'vk_') {
            ordered[key] = query[key];
          }
        });

      const stringParams = qs.stringify(ordered);
      const paramsHash = crypto
        .createHmac('sha256', this.config.vkSecretKey ?? '')
        .update(stringParams)
        .digest()
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=$/, '');

      const signed = paramsHash === query.sign;
      console.log(`[SignWSGuard] ws result`, signed);
      if (!signed) {
        next(new Error('Authentication error'));
      } else {
        next();
      }
    });

    const newTask = (taskId: number, listGUID: string) => {
      console.log('emit task', taskId);
      initServer.to(listGUID).emit(SocketEvents.new_task, taskId);
    };

    EventBus.on(BusEvents.NEW_TASK, newTask);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() listGUID: string,
  ) {
    await this.autoLeaveRooms(socket);

    const adapter = socket.adapter as RedisAdapter;

    adapter.remoteJoin(socket.id, listGUID, (error: Error) => {
      if (error) {
        console.info('joined room failed', listGUID);
        console.error('joined room error', error);
      } else {
        console.info('joined room ', listGUID);
        console.log('socket in', socket.rooms);
      }
    });

    socket.once('disconnect', () => {
      console.info('list socket disconnected');
      this.autoLeaveRooms(socket);
      socket.leaveAll();
    });
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() listGUID: string,
  ) {
    const adapter = socket.adapter as RedisAdapter;
    if (!!listGUID) {
      adapter.remoteLeave(socket.id, listGUID, (err: Error) => {
        if (err) {
          console.error(err);
        } else {
          console.log(socket.id, 'left room', listGUID);
        }
      });
    }
  }

  autoLeaveRooms(socket: Socket) {
    return new Promise((res) => {
      const adapter = socket.adapter as RedisAdapter;
      adapter.clientRooms(socket.id, (err: Error, rooms: string[]) => {
        if (err) {
          console.error(err);
        } else if (rooms?.length) {
          console.log(socket.id, 'Socket rooms', rooms);
          rooms.reduce((r) => {
            adapter.remoteLeave(socket.id, r, (err: Error) => {
              if (err) {
                console.error(err);
              } else {
                console.log(socket.id, 'left room', r);
              }
            });
            return '';
          });
        }
        return res();
      });
    });
  }
}
