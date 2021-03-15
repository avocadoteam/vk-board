import { Injectable, Logger } from '@nestjs/common';
import {
  MarusyaAsk,
  MarusyaCommand,
  MarusyaResponse,
  MarusyaResponseTxt,
  MarusyaWaitState,
} from 'src/contracts/marusya';
import { MTasksService } from '../m-tasks.service';
import { noTasks } from '../quick-response';
import { sliceTasks } from './helpers';

@Injectable()
export class FinishScenario {
  private readonly logger = new Logger(FinishScenario.name);
  constructor(private readonly m: MTasksService) {}

  async marusyaFinishTask(ask: MarusyaAsk): Promise<MarusyaResponse> {
    this.logger.log('User start finish scenario');
    const { nlu } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;

    const vkUserId = 11437372; //user?.vk_user_id!;

    if (!list) return noTasks(ask);

    const foundTokens = nlu.tokens.slice(
      nlu.tokens.indexOf(
        nlu.tokens.find((v) => v.includes(MarusyaCommand.Task)) ?? '',
      ),
    );

    if (foundTokens.length > 1) {
      foundTokens.shift();
      const taskName = foundTokens.join(' ');
      const task = await this.m.getTaskByName(vkUserId, list, taskName);

      if (!task) {
        const tasks = await this.m.getTasks(vkUserId, list);

        if (!tasks.length) return noTasks(ask);

        return {
          response: {
            text: MarusyaResponseTxt.notFoundTaskButHasMoreTasks(
              taskName,
              sliceTasks(tasks),
            ),
            tts: MarusyaResponseTxt.notFoundTaskButHasMoreTasks(
              taskName,
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
            wait: MarusyaWaitState.WaitForTaskNameToFinish,
          },
        };
      }

      await this.m.finishTask([task.id], list, vkUserId);

      return {
        response: {
          text: MarusyaResponseTxt.taskFinished(task.name),
          tts: MarusyaResponseTxt.taskFinished(task.name),
          end_session: true,
        },
        session: {
          message_id: ask.session.message_id,
          session_id: ask.session.session_id,
          user_id: ask.session.application.application_id,
        },
        version: '1.0',
      };
    } else {
      const tasks = await this.m.getTasks(vkUserId, list);
      return {
        response: {
          text: MarusyaResponseTxt.askTaskNameFinish(sliceTasks(tasks)),
          tts: MarusyaResponseTxt.askTaskNameFinish(sliceTasks(tasks)),
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
          wait: MarusyaWaitState.WaitForTaskNameToFinish,
        },
      };
    }
  }

  async marusyaWaitForTaskNameToFinish(
    ask: MarusyaAsk,
  ): Promise<MarusyaResponse> {
    this.logger.log('User tell task name to finish');
    const { command } = ask.request;
    const { user } = ask.session;
    const { list } = ask.state.user;

    const vkUserId = 11437372; //user?.vk_user_id!;

    const task = await this.m.getTaskByName(
      vkUserId,
      list!,
      command.toLowerCase(),
    );

    if (!task) {
      const tasks = await this.m.getTasks(vkUserId, list!);

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
          wait: MarusyaWaitState.WaitForTaskNameToFinish,
        },
      };
    }

    await this.m.finishTask([task.id], list!, vkUserId);

    return {
      response: {
        text: MarusyaResponseTxt.taskFinished(task.name),
        tts: MarusyaResponseTxt.taskFinished(task.name),
        end_session: true,
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
