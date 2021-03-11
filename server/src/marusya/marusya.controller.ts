import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { and, not, or } from 'ramda';
import {
  MarusyaAsk,
  marusyaCards,
  MarusyaCommand,
  MarusyaResponse,
  MarusyaResponseTxt,
  MarusyaWaitState,
} from 'src/contracts/marusya';
import { MarusyaGuard } from 'src/guards/marusya.guard';
import { ScenarioService } from './scenario.service';

@Controller('api/marusya')
@UseGuards(MarusyaGuard)
export class MarusyaController {
  constructor(
    private readonly scenario: ScenarioService,
    private readonly config: ConfigService,
  ) {}
  @Post()
  async randomShit(@Body() ask: MarusyaAsk): Promise<MarusyaResponse> {
    const res = await this.getMarusyaRes(ask);

    console.log(JSON.stringify(res));
    return res;
  }

  private async getMarusyaRes(ask: MarusyaAsk): Promise<MarusyaResponse> {
    try {
      const { command: vkCommand, nlu, original_utterance } = ask.request;
      const { user } = ask.session;
      const { wait } = ask.state.session;
      const command = !!original_utterance
        ? original_utterance.toLowerCase()
        : nlu.tokens.join(' ').toLowerCase();
      ask.request.command = command;
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

      if (
        vkCommand === MarusyaCommand.Interrupt ||
        or(command === MarusyaCommand.Exit, command === MarusyaCommand.Stop)
      ) {
        return {
          response: {
            text: MarusyaResponseTxt.bye,
            tts: MarusyaResponseTxt.bye,
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

      if (wait) {
        switch (wait) {
          case MarusyaWaitState.WaitForTaskName:
            const tnres = await this.scenario.marusyaWaitForTaskName(ask);
            return tnres;
          case MarusyaWaitState.WaitForTaskNameToFinish:
            const tnfres = await this.scenario.marusyaWaitForTaskNameToFinish(
              ask,
            );
            return tnfres;
          case MarusyaWaitState.WaitForUserChoise:
            const ucres = await this.scenario.marusyaProcessUserChoise(ask);
            return ucres;
          case MarusyaWaitState.WaitForDescription:
            const cdres = await this.scenario.marusyaChangeDescription(ask);
            return cdres;
          case MarusyaWaitState.WaitForTime:
            const ctres = await this.scenario.marusyaChangeTime(ask);
            return ctres;
          case MarusyaWaitState.WaitForShowTaskInfo:
            const stires = await this.scenario.marusyaShowTaskInfo(ask);
            return stires;
          case MarusyaWaitState.WaitForChangeTaskName:
            const ctnres = await this.scenario.marusyaChangeTaskName(ask);
            return ctnres;
          default:
            break;
        }
      }

      if (
        and(
          command.includes(MarusyaCommand.Finish),
          command.includes(MarusyaCommand.Task),
        )
      ) {
        const mtres = await this.scenario.marusyaFinishTask(ask);
        return mtres;
      }

      if (
        and(
          command.includes(MarusyaCommand.Create),
          command.includes(MarusyaCommand.Task),
        ) ||
        and(
          and(
            not(command.includes(MarusyaCommand.My)),
            not(command.includes(MarusyaCommand.Show)),
          ),
          command.includes(MarusyaCommand.Task),
        )
      ) {
        const mtres = await this.scenario.marusyaCreateTask(ask);
        return mtres;
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
        ) ||
        and(
          command.includes(MarusyaCommand.Show),
          command.includes(MarusyaCommand.Task),
        )
      ) {
        const stres = await this.scenario.marusyaShowTasks(ask);
        return stres;
      }

      return {
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
      };
    } catch (error) {
      console.error(error);
      return this.scenario.marusyaError(ask);
    }
  }
}
