import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { and, or } from 'ramda';
import {
  MarusyaAsk,
  MarusyaCommand,
  MarusyaPayload,
  MarusyaResponse,
  MarusyaUserWelcomeChoice,
  MarusyaWaitState,
} from 'src/contracts/marusya';
import { MarusyaGuard } from 'src/guards/marusya.guard';
import { MTasksService } from './m-tasks.service';
import { marusyaBye, marusyaError, marusyaNoCommands } from './quick-response';
import { CreateScenario } from './scenarios/create.scenario';
import { FinishScenario } from './scenarios/finish.scenario';
import { ShowScenario } from './scenarios/show.scenario';
import { UserChoiceScenario } from './scenarios/user-choice.scenario';
import { WelcomeScenario } from './scenarios/welcome.scenario';

@Controller('api/marusya')
@UseGuards(MarusyaGuard)
export class MarusyaController {
  constructor(
    private readonly ws: WelcomeScenario,
    private readonly fs: FinishScenario,
    private readonly cs: CreateScenario,
    private readonly ss: ShowScenario,
    private readonly ucs: UserChoiceScenario,
    private readonly m: MTasksService,
    private readonly config: ConfigService,
  ) {}
  @Post()
  async randomShit(@Body() ask: MarusyaAsk): Promise<MarusyaResponse> {
    const vkUserId = 11437372; //user?.vk_user_id!;

    const list = await this.checkUserList(vkUserId, ask.state.user.list);
    ask.state.user.list = list;
    const res = await this.getMarusyaRes(ask);

    if (list) {
      res.user_state_update = {
        ...(res.user_state_update ?? {}),
        list,
      };
    }
    console.log(JSON.stringify(res));
    return res;
  }

  private async checkUserList(vkUserId: number, list?: number) {
    if (!list) return list;

    const newList = await this.m.checkListOrCreateNew(vkUserId, list);

    return newList;
  }

  private async getMarusyaRes(ask: MarusyaAsk): Promise<MarusyaResponse> {
    try {
      const {
        command: vkCommand,
        nlu,
        original_utterance,
        payload,
      } = ask.request;
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

      if (this.shouldStopSkill(vkCommand, command)) {
        return marusyaBye(ask);
      }

      const userInProgress = await this.processWaitState(ask);

      if (userInProgress) {
        return userInProgress;
      }

      if (this.shouldDisplayWelcome(command, ask.session.new)) {
        return this.ws.marusyaWelcomeChoices(ask);
      }

      if (this.shouldFinishTask(command, payload)) {
        const mtres = await this.fs.marusyaFinishTask(ask);
        return mtres;
      }

      if (this.shouldCreateTask(command, payload)) {
        const mtres = await this.cs.marusyaCreateTask(ask);
        return mtres;
      }

      if (this.shouldShowTaskList(command, payload)) {
        const stres = await this.ss.marusyaShowTasks(ask);
        return stres;
      }

      return marusyaNoCommands(ask);
    } catch (error) {
      console.error(error);
      return marusyaError(ask);
    }
  }

  private async processWaitState(
    ask: MarusyaAsk,
  ): Promise<MarusyaResponse | undefined> {
    const { wait } = ask.state.session;
    if (!wait) return undefined;
    switch (wait) {
      case MarusyaWaitState.WaitForTaskName:
        const tnres = await this.ucs.marusyaWaitForTaskName(ask);
        return tnres;
      case MarusyaWaitState.WaitForTaskNameToFinish:
        const tnfres = await this.fs.marusyaWaitForTaskNameToFinish(ask);
        return tnfres;
      case MarusyaWaitState.WaitForUserChoice:
        const ucres = await this.ucs.marusyaProcessUserChoice(ask);
        return ucres;
      case MarusyaWaitState.WaitForDescription:
        const cdres = await this.ucs.marusyaChangeDescription(ask);
        return cdres;
      case MarusyaWaitState.WaitForTime:
        const ctres = await this.ucs.marusyaChangeTime(ask);
        return ctres;
      case MarusyaWaitState.WaitForShowTaskInfo:
        const stires = await this.ss.marusyaShowTaskInfo(ask);
        return stires;
      case MarusyaWaitState.WaitForChangeTaskName:
        const ctnres = await this.ucs.marusyaChangeTaskName(ask);
        return ctnres;
      default:
        break;
    }
  }

  private notIncludesOtherCommands(command: string) {
    return (
      !command.includes(MarusyaCommand.Finish) &&
      !command.includes(MarusyaCommand.Create) &&
      !command.includes(MarusyaCommand.Show) &&
      !command.includes(MarusyaCommand.My) &&
      !command.includes(MarusyaCommand.List)
    );
  }

  private shouldShowTaskList(command: string, payload?: MarusyaPayload) {
    return (
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
      ) ||
      and(
        command.includes(MarusyaCommand.List),
        command.includes(MarusyaCommand.Task),
      ) ||
      payload?.welcome === MarusyaUserWelcomeChoice.list
    );
  }

  private shouldCreateTask(command: string, payload?: MarusyaPayload) {
    return or(
      and(
        command.includes(MarusyaCommand.Create),
        command.includes(MarusyaCommand.Task),
      ),
      payload?.welcome === MarusyaUserWelcomeChoice.create,
    );
  }

  private shouldFinishTask(command: string, payload?: MarusyaPayload) {
    return or(
      and(
        command.includes(MarusyaCommand.Finish),
        command.includes(MarusyaCommand.Task),
      ),
      payload?.welcome === MarusyaUserWelcomeChoice.end,
    );
  }

  private shouldDisplayWelcome(command: string, newSession: boolean) {
    return (
      and(command.includes(MarusyaCommand.Task), newSession) &&
      this.notIncludesOtherCommands(command)
    );
  }

  private shouldStopSkill(vkCommand: string, command: string) {
    return (
      vkCommand === MarusyaCommand.Interrupt ||
      or(command === MarusyaCommand.Exit, command === MarusyaCommand.Stop)
    );
  }
}
