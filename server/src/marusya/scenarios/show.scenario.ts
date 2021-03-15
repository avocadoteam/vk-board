import { Injectable, Logger } from '@nestjs/common';
import {
  MarusyaAsk,
  marusyaButtons,
  MarusyaResponse,
  MarusyaResponseTxt,
  MarusyaTaskState,
  MarusyaWaitState,
} from 'src/contracts/marusya';
import { MTasksService } from '../m-tasks.service';
import { marusyaError, noTasks } from '../quick-response';
import { sliceTasks } from './helpers';

@Injectable()
export class ShowScenario {
  private readonly logger = new Logger(ShowScenario.name);
  constructor(private readonly m: MTasksService) {}

  async marusyaShowTasks(ask: MarusyaAsk): Promise<MarusyaResponse> {
    this.logger.log('User start show scenario');
    const { user } = ask.session;
    const { list } = ask.state.user;

    const vkUserId = 11437372; //user?.vk_user_id!;
    const tasks = list ? await this.m.getTasks(vkUserId, list) : [];
    if (!tasks.length) return noTasks(ask);
    return {
      response: {
        text: MarusyaResponseTxt.tasks(sliceTasks(tasks)),
        tts: MarusyaResponseTxt.tasks(sliceTasks(tasks)),
        end_session: false,
        buttons: tasks,
      },
      session: {
        message_id: ask.session.message_id,
        session_id: ask.session.session_id,
        user_id: ask.session.application.application_id,
      },
      version: '1.0',
      session_state: {
        wait: MarusyaWaitState.WaitForShowTaskInfo,
        taskState: MarusyaTaskState.update,
      },
    };
  }

  async marusyaShowTaskInfo(ask: MarusyaAsk): Promise<MarusyaResponse> {
    this.logger.log('User wants to show task info');
    const { payload, command } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;
    const { taskState, wait } = ask.state.session;
    const vkUserId = 11437372; //user?.vk_user_id!;

    const taskId =
      payload?.taskId ??
      (await this.m.getTaskByName(vkUserId, list!, command.toLowerCase()))?.id;

    if (!taskId) {
      const tasks = await this.m.getTasks(vkUserId, list!);
      if (!tasks.length) return noTasks(ask);

      return {
        response: {
          text: MarusyaResponseTxt.notFoundTaskButHasMoreTasks(
            command,
            sliceTasks(tasks),
          ),
          tts: MarusyaResponseTxt.notFoundTaskButHasMoreTasks(
            command,
            sliceTasks(tasks),
          ),
          end_session: false,
          buttons: tasks,
        },
        session: {
          message_id: ask.session.message_id,
          session_id: ask.session.session_id,
          user_id: ask.session.application.application_id,
        },
        version: '1.0',
        session_state: {
          wait,
          taskState,
        },
      };
    }
    const task = await this.m.getTask(vkUserId, list!, taskId);
    if (!task) return marusyaError(ask);

    return {
      response: {
        text: MarusyaResponseTxt.taskFound(
          task.name,
          task.dueDate,
          task.description,
        ),
        tts: MarusyaResponseTxt.taskFound(
          task.name,
          task.dueDate,
          task.description,
        ),
        end_session: false,
        buttons: marusyaButtons.choice,
      },
      session: {
        message_id: ask.session.message_id,
        session_id: ask.session.session_id,
        user_id: ask.session.application.application_id,
      },
      version: '1.0',
      session_state: {
        wait: MarusyaWaitState.WaitForUserChoice,
        taskId: task.id,
        taskState,
      },
    };
  }
}
