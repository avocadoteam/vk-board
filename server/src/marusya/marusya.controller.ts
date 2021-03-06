import { Body, Controller, Post } from '@nestjs/common';
import { and } from 'ramda';
import {
  MarusyaAsk,
  marusyaCards,
  MarusyaCommand,
  MarusyaResponse,
  MarusyaResponseTxt,
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

    if (!user || !user.vk_user_id) {
      return {
        response: {
          text: MarusyaResponseTxt.noUser,
          tts: MarusyaResponseTxt.noUser.join(' '),
          end_session: true,
          card: marusyaCards.stuff,
        },
        session: {
          message_id: ask.session.message_id,
          session_id: ask.session.session_id,
          user_id: ask.session.application.application_id,
        },
        version: '1.0',
      };
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
      and(
        command.includes(MarusyaCommand.My),
        command.includes(MarusyaCommand.Task),
      ) &&
      command.includes(MarusyaCommand.Show)
    ) {
      return this.scenario.marusyaShowTasks(ask);
    }

    if (wait) {
      return this.scenario.marusyaWaitForTaskName(ask);
    }

    return {
      response: {
        text: MarusyaResponseTxt.noUser,
        tts: MarusyaResponseTxt.noUser.join(' '),
        end_session: true,
        card: marusyaCards.stuff,
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
