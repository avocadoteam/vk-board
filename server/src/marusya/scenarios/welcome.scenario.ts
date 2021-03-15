import { Injectable, Logger } from '@nestjs/common';
import {
  MarusyaAsk,
  marusyaButtons,
  MarusyaResponse,
  MarusyaResponseTxt,
} from 'src/contracts/marusya';

@Injectable()
export class WelcomeScenario {
  private readonly logger = new Logger(WelcomeScenario.name);
  constructor() {}

  marusyaWelcomeChoices(ask: MarusyaAsk): MarusyaResponse {
    this.logger.log('Welcome new user');
    return {
      response: {
        text: MarusyaResponseTxt.welcome,
        tts: MarusyaResponseTxt.welcome,
        end_session: false,
        buttons: marusyaButtons.welcome,
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
