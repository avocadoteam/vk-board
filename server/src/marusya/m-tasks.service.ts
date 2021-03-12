import { Injectable, Logger } from '@nestjs/common';
import { UpdateTaskModel } from 'src/contracts/task';
import { ListService } from 'src/list/list.service';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class MTasksService {
  private readonly logger = new Logger(MTasksService.name);
  constructor(
    private readonly listServ: ListService,
    private readonly taskServ: TasksService,
  ) {}

  async checkListOrCreateNew(vkUserId: number, listId: number) {
    if (await this.listServ.hasListMembership([listId], vkUserId)) {
      return listId;
    }

    const newListId = await this.listServ.createList(
      { name: 'Список задач' },
      vkUserId,
    );
    return newListId;
  }

  async createTaskAndList(vkUserId: number, taskName: string, listId?: number) {
    let list =
      listId ??
      (await this.listServ.createList({ name: 'Список задач' }, vkUserId));

    const task = await this.taskServ.createTask(
      {
        name: taskName,
        description: null,
        dueDate: null,
        listId: list,
        notification: false,
      },
      vkUserId,
    );

    return { list, task };
  }

  async getTasks(vkUserId: number, listId: number) {
    const tasks = await this.taskServ.getNotFinishedTasks(listId, vkUserId);

    return tasks.map((t) => ({
      title: t.name,
      payload: {
        taskId: t.id,
      },
    }));
  }
  async getTask(vkUserId: number, listId: number, taskId: string) {
    const tasks = await this.taskServ.getTask(listId, vkUserId, taskId);

    if (!tasks || !tasks[0]) {
      return null;
    }

    return tasks[0];
  }
  async getTaskByName(vkUserId: number, listId: number, taskName: string) {
    const tasks = await this.taskServ.getTaskByName(listId, vkUserId, taskName);

    if (!tasks || !tasks[0]) {
      return null;
    }

    return tasks[0];
  }
  async updateTask(model: UpdateTaskModel, vkUserId: number) {
    const taskIdsToUpdate = await this.listServ.hasListMembershipWithTasks(
      [model.listId],
      [model.id],
      vkUserId,
    );

    if (!taskIdsToUpdate) {
      throw new Error('Someone hacking');
    }

    await this.taskServ.updateTask(model, vkUserId);
  }
  finishTask(taskIds: string[], listId: number, vkUserId: number) {
    return this.taskServ.finishTasks(taskIds, listId, vkUserId);
  }
  validateDueDate(dueDate: string | null) {
    return this.taskServ.validateDueDate(dueDate);
  }
}
