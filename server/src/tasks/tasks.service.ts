import { Injectable, CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Task } from 'src/db/tables/task';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import {
  NewTaskModel,
  UpdateTaskModel,
  BoardTaskItem,
  TaskInfo,
} from 'src/contracts/task';
import { List } from 'src/db/tables/list';
import { TaskMembership } from 'src/db/tables/taskMembership';
import { CacheManager } from 'src/custom-types/cache';
import { cacheKey } from 'src/contracts/cache';
import { errMap } from 'src/utils/errors';
import { EventBus } from 'src/events/events.bus';
import { BusEvents } from 'src/contracts/enum';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectRepository(Task)
    private tableTask: Repository<Task>,
    @InjectRepository(List)
    private tableList: Repository<List>,
    private connection: Connection,
    @Inject(CACHE_MANAGER) private cache: CacheManager,
  ) {}

  async createTask(model: NewTaskModel, vkUserId: number) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const list = await queryRunner.manager.findOne<List>(List, model.listId, {
        where: { deleted: null },
      });

      if (!list) {
        throw new Error(`List doesn't exist ${model.listId}`);
      }

      const newTask = new Task(
        model.name,
        vkUserId,
        list,
        model.description,
        model.dueDate,
      );
      await queryRunner.manager.save(newTask);

      const taskMembership = new TaskMembership(vkUserId, newTask);
      await queryRunner.manager.save(taskMembership);

      await queryRunner.commitTransaction();

      await this.cache.del(cacheKey.tasks(String(model.listId)));

      EventBus.emit(BusEvents.NEW_TASK, {
        task: {
          id: newTask.id,
          created: newTask.created,
          deleted: null,
          description: newTask.description,
          dueDate: newTask.dueDate,
          finished: null,
          name: newTask.name,
        } as BoardTaskItem,
        listGUID: list.listguid,
      });

      return newTask.id;
    } catch (err) {
      this.logger.error(errMap(err));
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }
  async updateTask(model: UpdateTaskModel, vkUserId: number) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const list = await queryRunner.manager.findOne<List>(List, model.listId, {
        where: { deleted: null },
      });

      if (!list) {
        throw new Error(`List doesn't exist ${model.listId}`);
      }

      await queryRunner.manager.update<Task>(Task, model.id, {
        name: model.name,
        description: model.description,
        dueDate: model.dueDate ? new Date(model.dueDate) : null,
      });

      await queryRunner.commitTransaction();

      await this.cache.del(cacheKey.tasks(String(model.listId)));

      EventBus.emit(BusEvents.UPDATE_TASK, {
        task: {
          id: model.id,
          description: model.description,
          dueDate: model.dueDate,
          name: model.name,
        } as TaskInfo,
        listGUID: list.listguid,
      });
    } catch (err) {
      this.logger.error(errMap(err));
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }

  async getTasks(listId: number, vkUserId: number) {
    let list = await this.tableList
      .createQueryBuilder('list')
      .innerJoinAndSelect(
        'list.tasks',
        'task',
        `task.list_id = ${listId} and task.deleted is null`,
      )
      .innerJoin(
        'list.memberships',
        'membership',
        `membership.joined_id = ${vkUserId} and membership.left_date is null`,
      )
      .where([
        {
          deleted: null,
          id: listId,
        },
      ])
      .orderBy({
        'task.created': 'DESC',
      })
      .getOne();

    return list?.tasks ?? [];
  }

  async finishTasks(taskIds: string[], listId: number) {
    const now = new Date();

    await this.tableTask.update(taskIds, { finished: now });

    await this.cache.del(cacheKey.tasks(String(listId)));

    const list = await this.tableList.findOne(listId, { select: ['listguid'] });
    if (list) {
      EventBus.emit(BusEvents.FINISH_TASKS, {
        taskIds,
        listGUID: list.listguid,
      });
    }
  }
  async unfinishTasks(taskIds: string[], listId: number) {
    await this.tableTask.update(taskIds, { finished: null });

    await this.cache.del(cacheKey.tasks(String(listId)));

    const list = await this.tableList.findOne(listId, { select: ['listguid'] });
    if (list) {
      EventBus.emit(BusEvents.UNFINISH_TASKS, {
        taskIds,
        listGUID: list.listguid,
      });
    }
  }
  async deleteTask(taskId: number, listId: number) {
    const now = new Date();

    await this.tableTask.update(taskId, { deleted: now });

    await this.cache.del(cacheKey.tasks(String(listId)));

    const list = await this.tableList.findOne(listId, { select: ['listguid'] });
    if (list) {
      EventBus.emit(BusEvents.DELETE_TASK, taskId, list.listguid);
    }
  }

  async hasTasksMembership(taskIds: number[], vkUserId: number) {
    return (
      (await this.tableTask
        .createQueryBuilder('task')
        .innerJoin(
          'task.memberships',
          'membership',
          `membership.joined_id = ${vkUserId}`,
        )
        .whereInIds(taskIds)
        .getCount()) > 0
    );
  }
}
