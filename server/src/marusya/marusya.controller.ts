import { Body, Controller, Post } from '@nestjs/common';
import { and, not } from 'ramda';
import {
  MarusyaAsk,
  MarusyaCommand,
  MarusyaResponse,
  MarusyaResponseTxt,
} from 'src/contracts/marusya';

@Controller('api/marusya')
export class MarusyaController {
  @Post()
  randomShit(@Body() ask: MarusyaAsk): MarusyaResponse {
    const { command, nlu } = ask.request;
    const { user } = ask.session;

    if (not(user)) {
      return {
        response: {
          text: MarusyaResponseTxt.noUser,
          tts: MarusyaResponseTxt.noUser,
          end_session: true,
          card: {
            type: 'MiniApp',
            url: 'https://vk.com/app7566928',
          },
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
      const taskName = nlu.tokens.slice(
        nlu.tokens.indexOf(MarusyaCommand.Task),
      );

      if (taskName) {
      }
      console.log(taskName);
    }

    return {
      response: {
        text: MarusyaResponseTxt.noUser,
        tts: MarusyaResponseTxt.noUser,
        end_session: true,
        card: {
          type: 'MiniApp',
          url: 'https://vk.com/app7566928',
        },
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
