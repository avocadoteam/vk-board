import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import {
  MarusyaAsk,
  marusyaButtons,
  MarusyaResponse,
  MarusyaResponseTxt,
  MarusyaUserChoice,
  MarusyaWaitState,
} from 'src/contracts/marusya';
import { MTasksService } from '../m-tasks.service';
import { marusyaError, validateTaskName } from '../quick-response';
import { getChoiceFromCommand, parseTime } from './helpers';

@Injectable()
export class UserChoiceScenario {
  private readonly logger = new Logger(UserChoiceScenario.name);
  constructor(private readonly m: MTasksService) {}

  marusyaWaitForTaskName(ask: MarusyaAsk): Promise<MarusyaResponse> {
    this.logger.log('User tell task name');
    const { nlu } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;
    const { taskState } = ask.state.session;
    const vkUserId = 11437372; //user?.vk_user_id!;

    const foundTokens = nlu.tokens;
    const taskName = foundTokens.join(' ');
    return validateTaskName(taskName, ask, async () => {
      const data = await this.m.createTaskAndList(vkUserId, taskName, list);
      return {
        response: {
          text: MarusyaResponseTxt.wantsMore,
          tts: MarusyaResponseTxt.wantsMore,
          end_session: false,
          buttons: marusyaButtons.choice,
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
          wait: MarusyaWaitState.WaitForUserChoice,
          taskId: data.task,
          taskState,
        },
      };
    });
  }

  async marusyaChangeDescription(ask: MarusyaAsk): Promise<MarusyaResponse> {
    this.logger.log('User change description');
    const { command } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;
    const { taskId, taskState } = ask.state.session;
    const vkUserId = 11437372; //user?.vk_user_id!;

    const task = await this.m.getTask(vkUserId, list!, taskId!);
    if (!task) return marusyaError(ask);

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
        taskId,
        taskState,
      },
    };
  }
  async marusyaChangeTime(ask: MarusyaAsk): Promise<MarusyaResponse> {
    this.logger.log('User change time');
    const { command, payload, nlu } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;
    const { taskId, taskState } = ask.state.session;
    const vkUserId = 11437372; //user?.vk_user_id!;

    const time = payload?.date ?? parseTime(command, nlu.tokens);
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
          taskState,
        },
      };
    }

    const task = await this.m.getTask(vkUserId, list!, taskId!);
    if (!task) return marusyaError(ask);

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
        taskId,
        taskState,
      },
    };
  }
  marusyaChangeTaskName(ask: MarusyaAsk): Promise<MarusyaResponse> {
    this.logger.log('User change task name');
    const { command } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;
    const { taskId, taskState } = ask.state.session;
    const vkUserId = 11437372; //user?.vk_user_id!;

    return validateTaskName(command, ask, async () => {
      const task = await this.m.getTask(vkUserId, list!, taskId!);
      if (!task) return marusyaError(ask);

      await this.m.updateTask(
        {
          description: task.description,
          dueDate: task.dueDate ? moment(task.dueDate).toDate() : null,
          id: task.id,
          listId: list!,
          name: command,
        },
        vkUserId,
      );

      return {
        response: {
          text: MarusyaResponseTxt.wantsChangeDone,
          tts: MarusyaResponseTxt.wantsChangeDone,
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
          taskId,
          taskState,
        },
      };
    });
  }

  async marusyaProcessUserChoice(ask: MarusyaAsk): Promise<MarusyaResponse> {
    this.logger.log('User tell its choice');
    const { payload, nlu } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;
    const { taskId, taskState } = ask.state.session;
    const vkUserId = 11437372; //user?.vk_user_id!;

    const choice = payload?.choice ?? getChoiceFromCommand(nlu.tokens);
    if (!choice || !taskId) {
      return marusyaError(ask);
    }

    switch (choice) {
      case MarusyaUserChoice.description:
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
            taskState,
          },
        };
      case MarusyaUserChoice.name:
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
            wait: MarusyaWaitState.WaitForChangeTaskName,
            taskId,
            taskState,
          },
        };
      case MarusyaUserChoice.time:
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
            taskState,
          },
        };

      case MarusyaUserChoice.end:
        const task = await this.m.getTask(vkUserId, list!, taskId);
        if (!task) return marusyaError(ask);
        return {
          response: {
            text: MarusyaResponseTxt.taskCreated(
              task.name,
              task.dueDate,
              taskState!,
            ),
            tts: MarusyaResponseTxt.taskCreated(
              task.name,
              task.dueDate,
              taskState!,
            ),
            end_session: true,
            // card: this.config.get('core.devMode')
            //   ? undefined
            //   : marusyaCards.stuff,
          },
          session: {
            message_id: ask.session.message_id,
            session_id: ask.session.session_id,
            user_id: ask.session.application.application_id,
          },
          version: '1.0',
        };

      default:
        return marusyaError(ask);
    }
  }
}
