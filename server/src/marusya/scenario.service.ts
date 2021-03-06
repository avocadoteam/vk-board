import { Injectable, Logger } from '@nestjs/common';
import {
  MarusyaAsk,
  marusyaCards,
  MarusyaCommand,
  MarusyaResponse,
  MarusyaResponseTxt,
  MarusyaWaitState,
} from 'src/contracts/marusya';
import { MTasksService } from './m-tasks.service';

@Injectable()
export class ScenarioService {
  private readonly logger = new Logger(ScenarioService.name);
  constructor(private readonly m: MTasksService) {}

  async marusyaCreateTask(ask: MarusyaAsk): Promise<MarusyaResponse> {
    const { nlu } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;

    const vkUserId = user?.vk_user_id!;

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
            text: MarusyaResponseTxt.taskCreated(taskName),
            tts: MarusyaResponseTxt.taskCreated(taskName),
            end_session: true,
            card: marusyaCards.stuff,
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
    const vkUserId = user?.vk_user_id!;

    const foundTokens = nlu.tokens;
    const taskName = foundTokens.join(' ');
    return this.validateTaskName(taskName, ask, async () => {
      const data = await this.m.createTaskAndList(vkUserId, taskName, list);
      return {
        response: {
          text: MarusyaResponseTxt.taskCreated(taskName),
          tts: MarusyaResponseTxt.taskCreated(taskName),
          end_session: true,
          card: marusyaCards.stuff,
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
      };
    });
  }
  async marusyaShowTasks(ask: MarusyaAsk): Promise<MarusyaResponse> {
    const { user } = ask.session;
    const { list } = ask.state.user;

    const vkUserId = user?.vk_user_id!;
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
          tts: MarusyaResponseTxt.taskNameLong.join(' '),
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
}
