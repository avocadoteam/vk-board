import { Body, Controller, Post } from '@nestjs/common';
import { and } from 'ramda';
import {
  MarusyaAsk,
  marusyaCards,
  MarusyaCommand,
  MarusyaResponse,
  MarusyaResponseTxt,
  MarusyaWaitState,
} from 'src/contracts/marusya';
import { ScenarioService } from './scenario.service';

@Controller('api/marusya')
export class MarusyaController {
  constructor(private readonly scenario: ScenarioService) {}
  @Post()
  async randomShit(@Body() ask: MarusyaAsk): Promise<MarusyaResponse> {
    const { command } = ask.request;
    const { user } = ask.session;
    const { wait } = ask.state.session;

    // if (!user || !user.vk_user_id) {
    //   return {
    //     response: {
    //       text: MarusyaResponseTxt.noUser,
    //       tts: MarusyaResponseTxt.noUser.join(' '),
    //       end_session: true,
    //       card: marusyaCards.stuff,
    //     },
    //     session: {
    //       message_id: ask.session.message_id,
    //       session_id: ask.session.session_id,
    //       user_id: ask.session.application.application_id,
    //     },
    //     version: '1.0',
    //   };
    // }

    if (wait) {
      switch (wait) {
        case MarusyaWaitState.WaitForTaskName:
          return this.scenario.marusyaWaitForTaskName(ask);
        case MarusyaWaitState.WaitForUserChoise:
          return this.scenario.marusyaProcessUserChoise(ask);
        case MarusyaWaitState.WaitForDescription:
          return this.scenario.marusyaChangeDescription(ask);
        case MarusyaWaitState.WaitForTime:
          return this.scenario.marusyaChangeTime(ask);
        default:
          break;
      }
    }

    if (
      and(
        command.includes(MarusyaCommand.Create),
        command.includes(MarusyaCommand.Task),
      )
    ) {
      return this.scenario.marusyaCreateTask(ask);
    }

    if (
      (and(
        command.includes(MarusyaCommand.My),
        command.includes(MarusyaCommand.Task),
      ) &&
        command.includes(MarusyaCommand.Show)) ||
      and(
        command.includes(MarusyaCommand.My),
        command.includes(MarusyaCommand.Task),
      )
    ) {
      return this.scenario.marusyaShowTasks(ask);
    }

    return {
      response: {
        text: MarusyaResponseTxt.noUser,
        tts: MarusyaResponseTxt.noUser,
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
