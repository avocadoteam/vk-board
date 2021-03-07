import { Injectable, Logger } from '@nestjs/common';
import {
  MarusyaAsk,
  marusyaButtons,
  marusyaCards,
  MarusyaCommand,
  MarusyaResponse,
  MarusyaResponseTxt,
  MarusyaUserChoise,
  MarusyaWaitState,
} from 'src/contracts/marusya';
import { MTasksService } from './m-tasks.service';
import * as moment from 'moment';

@Injectable()
export class ScenarioService {
  private readonly logger = new Logger(ScenarioService.name);
  constructor(private readonly m: MTasksService) {}

  async marusyaCreateTask(ask: MarusyaAsk): Promise<MarusyaResponse> {
    const { nlu } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;

    const vkUserId = 11437372; //user?.vk_user_id!;

    const foundTokens = nlu.tokens.slice(
      nlu.tokens.indexOf(
        nlu.tokens.find((v) => v.includes(MarusyaCommand.Task)) ?? '',
      ),
    );

    if (foundTokens.length > 1) {
      foundTokens.shift();
      const taskName = foundTokens.join(' ');
      return this.validateTaskName(taskName, ask, async () => {
        const data = await this.m.createTaskAndList(vkUserId, taskName, list);
        return {
          response: {
            text: MarusyaResponseTxt.wantsMore,
            tts: MarusyaResponseTxt.wantsMore,
            end_session: false,
            buttons: marusyaButtons.choise,
          },
          session: {
            message_id: ask.session.message_id,
            session_id: ask.session.session_id,
            user_id: ask.session.application.application_id,
          },
          version: '1.0',
          user_state_update: {
            list: data.list,
          },
          session_state: {
            wait: MarusyaWaitState.WaitForUserChoise,
            taskId: data.task,
          },
        };
      });
    } else {
      return {
        response: {
          text: MarusyaResponseTxt.askTaskName,
          tts: MarusyaResponseTxt.askTaskName,
          end_session: false,
        },
        session: {
          message_id: ask.session.message_id,
          session_id: ask.session.session_id,
          user_id: ask.session.application.application_id,
        },
        version: '1.0',
        session_state: {
          wait: MarusyaWaitState.WaitForTaskName,
        },
      };
    }
  }

  marusyaWaitForTaskName(ask: MarusyaAsk): Promise<MarusyaResponse> {
    const { nlu } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;
    const vkUserId = 11437372; //user?.vk_user_id!;

    const foundTokens = nlu.tokens;
    const taskName = foundTokens.join(' ');
    return this.validateTaskName(taskName, ask, async () => {
      const data = await this.m.createTaskAndList(vkUserId, taskName, list);
      return {
        response: {
          text: MarusyaResponseTxt.wantsMore,
          tts: MarusyaResponseTxt.wantsMore,
          end_session: false,
          buttons: marusyaButtons.choise,
        },
        session: {
          message_id: ask.session.message_id,
          session_id: ask.session.session_id,
          user_id: ask.session.application.application_id,
        },
        version: '1.0',
        user_state_update: {
          list: data.list,
        },
        session_state: {
          wait: MarusyaWaitState.WaitForUserChoise,
          taskId: data.task,
        },
      };
    });
  }

  async marusyaChangeDescription(ask: MarusyaAsk): Promise<MarusyaResponse> {
    const { command } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;
    const { taskId } = ask.state.session;
    const vkUserId = 11437372; //user?.vk_user_id!;

    const task = await this.m.getTask(vkUserId, list!, taskId!);
    if (!task) return this.marusyaError(ask);

    await this.m.updateTask(
      {
        description: command,
        dueDate: task.dueDate ? moment(task.dueDate).toDate() : null,
        id: task.id,
        listId: list!,
        name: task.name,
      },
      vkUserId,
    );

    return {
      response: {
        text: MarusyaResponseTxt.wantsChangeReady,
        tts: MarusyaResponseTxt.wantsChangeReady,
        end_session: false,
        buttons: marusyaButtons.choise,
      },
      session: {
        message_id: ask.session.message_id,
        session_id: ask.session.session_id,
        user_id: ask.session.application.application_id,
      },
      version: '1.0',
      session_state: {
        wait: MarusyaWaitState.WaitForUserChoise,
        taskId,
      },
    };
  }
  async marusyaChangeTime(ask: MarusyaAsk): Promise<MarusyaResponse> {
    const { command, payload } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;
    const { taskId } = ask.state.session;
    const vkUserId = 11437372; //user?.vk_user_id!;

    const time = payload?.date ?? moment().day(command).format();
    if (!this.m.validateDueDate(time)) {
      return {
        response: {
          text: MarusyaResponseTxt.wrongTime,
          tts: MarusyaResponseTxt.wrongTime,
          end_session: false,
          buttons: marusyaButtons.weekDays(),
        },
        session: {
          message_id: ask.session.message_id,
          session_id: ask.session.session_id,
          user_id: ask.session.application.application_id,
        },
        version: '1.0',
        session_state: {
          wait: MarusyaWaitState.WaitForTime,
          taskId,
        },
      };
    }

    const task = await this.m.getTask(vkUserId, list!, taskId!);
    if (!task) return this.marusyaError(ask);

    await this.m.updateTask(
      {
        description: task.description,
        dueDate: time,
        id: task.id,
        listId: list!,
        name: task.name,
      },
      vkUserId,
    );

    return {
      response: {
        text: MarusyaResponseTxt.wantsChangeDone,
        tts: MarusyaResponseTxt.wantsChangeDone,
        end_session: false,
        buttons: marusyaButtons.choise,
      },
      session: {
        message_id: ask.session.message_id,
        session_id: ask.session.session_id,
        user_id: ask.session.application.application_id,
      },
      version: '1.0',
      session_state: {
        wait: MarusyaWaitState.WaitForUserChoise,
        taskId,
      },
    };
  }

  async marusyaProcessUserChoise(ask: MarusyaAsk): Promise<MarusyaResponse> {
    const { payload } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;
    const { taskId } = ask.state.session;
    const vkUserId = 11437372; //user?.vk_user_id!;

    if (!payload?.choise || !taskId) {
      return this.marusyaError(ask);
    }

    switch (payload.choise) {
      case MarusyaUserChoise.description:
        return {
          response: {
            text: MarusyaResponseTxt.listen,
            tts: MarusyaResponseTxt.listen,
            end_session: false,
          },
          session: {
            message_id: ask.session.message_id,
            session_id: ask.session.session_id,
            user_id: ask.session.application.application_id,
          },
          version: '1.0',
          session_state: {
            wait: MarusyaWaitState.WaitForDescription,
            taskId,
          },
        };
      case MarusyaUserChoise.time:
        return {
          response: {
            text: MarusyaResponseTxt.time,
            tts: MarusyaResponseTxt.time,
            end_session: false,
            buttons: marusyaButtons.weekDays(),
          },
          session: {
            message_id: ask.session.message_id,
            session_id: ask.session.session_id,
            user_id: ask.session.application.application_id,
          },
          version: '1.0',
          session_state: {
            wait: MarusyaWaitState.WaitForTime,
            taskId,
          },
        };

      case MarusyaUserChoise.end:
        const task = await this.m.getTask(vkUserId, list!, taskId);
        if (!task) return this.marusyaError(ask);
        return {
          response: {
            text: MarusyaResponseTxt.taskCreated(task.name, task.dueDate),
            tts: MarusyaResponseTxt.taskCreated(task.name, task.dueDate),
            end_session: true,
            // card: marusyaCards.stuff,
          },
          session: {
            message_id: ask.session.message_id,
            session_id: ask.session.session_id,
            user_id: ask.session.application.application_id,
          },
          version: '1.0',
        };

      default:
        return this.marusyaError(ask);
    }
  }
  async marusyaShowTasks(ask: MarusyaAsk): Promise<MarusyaResponse> {
    const { user } = ask.session;
    const { list } = ask.state.user;

    const vkUserId = 11437372; //user?.vk_user_id!;
    const tasks = list ? await this.m.getTasks(vkUserId, list) : [];
    return {
      response: {
        text: tasks.length
          ? MarusyaResponseTxt.tasks
          : MarusyaResponseTxt.noTasks,
        tts: tasks.length
          ? MarusyaResponseTxt.tasks
          : MarusyaResponseTxt.noTasks,
        end_session: false,
        buttons: tasks.length ? tasks : undefined,
      },
      session: {
        message_id: ask.session.message_id,
        session_id: ask.session.session_id,
        user_id: ask.session.application.application_id,
      },
      version: '1.0',
    };
  }

  private async validateTaskName(
    taskName: string,
    ask: MarusyaAsk,
    action: () => Promise<MarusyaResponse>,
  ): Promise<MarusyaResponse> {
    if (taskName.length > 256) {
      return {
        response: {
          text: MarusyaResponseTxt.taskNameLong,
          tts: MarusyaResponseTxt.taskNameLong,
          end_session: false,
        },
        session: {
          message_id: ask.session.message_id,
          session_id: ask.session.session_id,
          user_id: ask.session.application.application_id,
        },
        version: '1.0',
        session_state: {
          wait: MarusyaWaitState.WaitForTaskName,
        },
      };
    }
    const res = await action();
    return res;
  }

  marusyaError(ask: MarusyaAsk): MarusyaResponse {
    return {
      response: {
        text: MarusyaResponseTxt.error,
        tts: MarusyaResponseTxt.error,
        end_session: true,
        // card: marusyaCards.stuff,
      },
      session: {
        message_id: ask.session.message_id,
        session_id: ask.session.session_id,
        user_id: ask.session.application.application_id,
      },
      version: '1.0',
    };
  }
}
