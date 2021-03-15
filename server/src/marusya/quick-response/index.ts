import {
  MarusyaAsk,
  MarusyaResponse,
  MarusyaResponseTxt,
  MarusyaWaitState,
} from 'src/contracts/marusya';

export const noTasks = (ask: MarusyaAsk): MarusyaResponse => ({
  response: {
    text: MarusyaResponseTxt.noTasks,
    tts: MarusyaResponseTxt.noTasks,
    end_session: false,
  },
  session: {
    message_id: ask.session.message_id,
    session_id: ask.session.session_id,
    user_id: ask.session.application.application_id,
  },
  version: '1.0',
  session_state: {
    wait: MarusyaWaitState.WaitForReactionAfterNoTaskFound,
  },
});

export const validateTaskName = async (
  taskName: string,
  ask: MarusyaAsk,
  action: () => Promise<MarusyaResponse>,
): Promise<MarusyaResponse> => {
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
      session_state: ask.state.session,
    };
  }
  const res = await action();
  return res;
};

export const marusyaError = (ask: MarusyaAsk): MarusyaResponse => {
  return {
    response: {
      text: MarusyaResponseTxt.error,
      tts: MarusyaResponseTxt.error,
      end_session: true,
      // card: this.config.get('core.devMode') ? undefined : marusyaCards.stuff,
    },
    session: {
      message_id: ask.session.message_id,
      session_id: ask.session.session_id,
      user_id: ask.session.application.application_id,
    },
    version: '1.0',
  };
};
export const marusyaNoCommands = (ask: MarusyaAsk): MarusyaResponse => ({
  response: {
    text: MarusyaResponseTxt.noCommands,
    tts: MarusyaResponseTxt.noCommands,
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
});
export const marusyaBye = (ask: MarusyaAsk): MarusyaResponse => ({
  response: {
    text: MarusyaResponseTxt.bye,
    tts: MarusyaResponseTxt.bye,
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
});
