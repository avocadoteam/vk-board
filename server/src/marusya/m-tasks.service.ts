import { Injectable, Logger } from '@nestjs/common';
import { ListService } from 'src/list/list.service';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class MTasksService {
  private readonly logger = new Logger(MTasksService.name);
  constructor(
    private readonly listServ: ListService,
    private readonly taskServ: TasksService,
  ) {}

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
    const tasks = await this.taskServ.getTasks(listId, vkUserId);

    return tasks.map((t) => ({
      title: t.name,
      payload: {
        taskId: t.id,
      },
    }));
  }
}
