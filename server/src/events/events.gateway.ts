import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  NameSpaces,
  SocketEvents,
  BusEvents,
  NewTaskParams,
  FinishTaskParams,
  UpdateTaskParams,
  ListUpdatedParams,
  TaskNotificationParams,
} from 'src/contracts/enum';
import { EventBus } from './events.bus';
import { Inject, Logger } from '@nestjs/common';
import * as qs from 'querystring';
import * as crypto from 'crypto';
import integrationConfig from 'src/config/integration.config';
import { ConfigType } from '@nestjs/config';
import { RedisAdapter } from 'socket.io-redis';
import { errMap } from 'src/utils/errors';

@WebSocketGateway({ namespace: NameSpaces.SelctedList })
export class EventsGateway implements OnGatewayInit {
  private readonly logger = new Logger(EventsGateway.name);
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
      this.logger.log(`ws result ${signed}`);
      if (!signed) {
        next(new Error('Authentication error'));
      } else {
        next();
      }
    });

    const newTask = ({ task, listGUID }: NewTaskParams) => {
      this.logger.log(`emit task ${task.id}`);
      initServer.to(listGUID).emit(SocketEvents.new_task, task);
    };
    const updateTask = ({ task, listGUID }: UpdateTaskParams) => {
      this.logger.log(`emit update task ${task.id}`);
      initServer.to(listGUID).emit(SocketEvents.update_task, task);
    };
    const finishTasks = ({ taskIds, listGUID }: FinishTaskParams) => {
      this.logger.log(`emit finish tasks`);
      initServer.to(listGUID).emit(SocketEvents.finish_tasks, { taskIds });
    };
    const unfinishTasks = ({ taskIds, listGUID }: FinishTaskParams) => {
      this.logger.log(`emit unfinish tasks`);
      initServer.to(listGUID).emit(SocketEvents.unfinish_tasks, { taskIds });
    };
    const deleteTask = (taskId: string, listGUID: string) => {
      this.logger.log(`emit delete tasks`);
      initServer.to(listGUID).emit(SocketEvents.delete_task, taskId);
    };
    const stopGsync = (userId: number) => {
      this.logger.log(`emit stopGsync for user ${userId}`);
      initServer.to(userId.toString()).emit(SocketEvents.stop_g_sync);
    };
    const paymentComplete = (userId: number) => {
      this.logger.log(`emit paymentComplete for user ${userId}`);
      initServer.to(userId.toString()).emit(SocketEvents.payment_complete);
    };
    const listUpdated = (params: ListUpdatedParams) => {
      this.logger.log(`emit listUpdated ${params.updatedType}`);
      initServer.to(params.listGUID).emit(SocketEvents.list_updated, params);
      initServer
        .to(params.userId.toString())
        .emit(SocketEvents.list_updated, params);
    };

    const taskNewNotificationState = (model: TaskNotificationParams) => {
      this.logger.log(`emit taskNewNotificationState for user ${model.userId}`);
      initServer
        .to(model.userId.toString())
        .emit(SocketEvents.task_notification, {
          taskId: model.taskId,
          notification: model.notification,
        });
    };
    EventBus.on(BusEvents.STOP_G_SYNC, stopGsync);
    EventBus.on(BusEvents.NEW_TASK, newTask);
    EventBus.on(BusEvents.PAYMENT_COMPLETE, paymentComplete);
    EventBus.on(BusEvents.FINISH_TASKS, finishTasks);
    EventBus.on(BusEvents.UNFINISH_TASKS, unfinishTasks);
    EventBus.on(BusEvents.UPDATE_TASK, updateTask);
    EventBus.on(BusEvents.DELETE_TASK, deleteTask);
    EventBus.on(BusEvents.LIST_UPDATED, listUpdated);
    EventBus.on(BusEvents.TASK_NOTIFICATION, taskNewNotificationState);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { listGUID, userId }: { listGUID?: string; userId: number },
  ) {
    await this.autoLeaveRooms(socket);

    const adapter = socket.adapter as RedisAdapter;

    if (listGUID) {
      adapter.remoteJoin(socket.id, listGUID, (error: Error) => {
        if (error) {
          this.logger.log(`joined room failed ${listGUID}`);
          this.logger.error(errMap(error));
        } else {
          this.logger.log(`joined room ${listGUID}`);
        }
      });
    }

    adapter.remoteJoin(socket.id, userId.toString(), (error: Error) => {
      if (error) {
        this.logger.log(`joined room failed ${userId}`);
        this.logger.error(errMap(error));
      } else {
        this.logger.log(`joined room ${userId}`);
      }
    });
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { listGUID, userId }: { listGUID?: string; userId: number },
  ) {
    const adapter = socket.adapter as RedisAdapter;
    this.logger.log('list socket leave room');
    if (!!listGUID) {
      adapter.remoteLeave(socket.id, listGUID, (err: Error) => {
        if (err) {
          this.logger.error(errMap(err));
        }
      });
    }

    adapter.remoteLeave(socket.id, userId.toString(), (err: Error) => {
      if (err) {
        this.logger.error(errMap(err));
      }
    });
  }

  autoLeaveRooms(socket: Socket) {
    return new Promise((res) => {
      const adapter = socket.adapter as RedisAdapter;
      adapter.clientRooms(socket.id, (err: Error, rooms: string[]) => {
        if (err) {
          this.logger.error(errMap(err));
        } else if (rooms?.length) {
          rooms.reduce((r) => {
            adapter.remoteLeave(socket.id, r, (err: Error) => {
              if (err) {
                this.logger.error(errMap(err));
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
