import { Injectable } from '@nestjs/common';
import { Task } from 'src/db/tables/task';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { NewTaskModel } from 'src/contracts/task';
import { List } from 'src/db/tables/list';
import { TaskMembership } from 'src/db/tables/taskMembership';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tableTask: Repository<Task>,
    private connection: Connection,
  ) {}

  async createTask(model: NewTaskModel, vkUserId: number) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const list = await queryRunner.manager.findOne<List>(List, model.listId);

      if (!list) {
        throw new Error(`List doesn't exist ${model.listId}`);
      }

      const newTask = new Task(
        model.name,
        model.description,
        vkUserId,
        list,
        model.dueDate,
      );
      await queryRunner.manager.save(newTask);

      const taskMembership = new TaskMembership(vkUserId, newTask);
      await queryRunner.manager.save(taskMembership);

      await queryRunner.commitTransaction();

      return newTask.id;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getTasks(listId: number, vkUserId: number) {
    return this.tableTask
      .createQueryBuilder('task')
      .innerJoin('task.list', 'list', `list.id = ${listId}`)
      .innerJoin(
        'task.memberships',
        'membership',
        `membership.joinedId = ${vkUserId}`,
      )
      .where([
        {
          createdBy: vkUserId,
          deleted: null,
        },
      ])
      .orderBy({
        'task.created': 'DESC',
      })
      .getMany();
  }

  async finishTasks(taskIds: number[]) {
    const now = new Date();

    await this.tableTask.update(taskIds, { finished: now });
  }

  async hasTasksMembership(taskIds: number[], vkUserId: number) {
    return (
      (await this.tableTask
        .createQueryBuilder('task')
        .innerJoin(
          'task.memberships',
          'membership',
          `membership.joinedId = ${vkUserId}`,
        )
        .whereInIds(taskIds)
        .getCount()) > 0
    );
  }
}
