import { Injectable, Logger } from '@nestjs/common';
import {
  MarusyaAsk,
  MarusyaResponse,
  userNotWantTokens,
  userWantsTokens,
} from 'src/contracts/marusya';
import { marusyaBye } from '../quick-response';
import { CreateScenario } from './create.scenario';

@Injectable()
export class NoTaskScenario {
  private readonly logger = new Logger(NoTaskScenario.name);
  constructor(private readonly cs: CreateScenario) {}

  async marusyaWaitForReaction(ask: MarusyaAsk): Promise<MarusyaResponse> {
    this.logger.log('User reaction on no task');

    const { nlu } = ask.request;

    if (this.shouldContinue(nlu.tokens)) {
      return this.cs.marusyaAskTaskName(ask);
    }

    return marusyaBye(ask);
  }

  private shouldContinue(tokens: string[]) {
    return (
      !!tokens.find((t) => !!userWantsTokens.find((uw) => t.includes(uw))) &&
      !tokens.find((t) => !!userNotWantTokens.find((unw) => t.includes(unw)))
    );
  }
}
