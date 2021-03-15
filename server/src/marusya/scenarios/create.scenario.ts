import { Injectable, Logger } from '@nestjs/common';
import {
  MarusyaAsk,
  marusyaButtons,
  MarusyaCommand,
  MarusyaResponse,
  MarusyaResponseTxt,
  MarusyaTaskState,
  MarusyaWaitState,
} from 'src/contracts/marusya';
import { MTasksService } from '../m-tasks.service';
import { validateTaskName } from '../quick-response';

@Injectable()
export class CreateScenario {
  private readonly logger = new Logger(CreateScenario.name);
  constructor(private readonly m: MTasksService) {}

  async marusyaCreateTask(ask: MarusyaAsk): Promise<MarusyaResponse> {
    this.logger.log('User start create task scenario');
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
            taskState: MarusyaTaskState.create,
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
          taskState: MarusyaTaskState.create,
        },
      };
    }
  }
}
