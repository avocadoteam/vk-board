import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  MarusyaTaskState,
  MarusyaUserChoise,
  MarusyaWaitState,
} from './commands';

class MarusyaMeta {
  @IsString()
  client_id!: string;
  /**
   * ru_RU
   */
  @IsString()
  locale!: string;
  /**
   * 'Europe/Prague'
   */
  @IsString()
  timezone!: string;

  @IsObject()
  interfaces!: {
    screen: {};
  };
  @IsString()
  _city_ru!: string;
}

class MarusyaRequest {
  /**
   * stuff умения
   */
  @IsString()
  command!: string;

  @IsString()
  original_utterance!: string;

  @IsObject()
  nlu!: {
    tokens: string[];
    entities: string[];
  };

  @IsObject()
  payload?: {
    choise?: MarusyaUserChoise;
    /**
     * YYYY-MM-DD
     */
    date?: string;

    taskId?: string;
  };
}

class MarusyaSession {
  @IsString()
  session_id!: string;

  @IsString()
  skill_id!: string;

  @IsBoolean()
  new!: boolean;

  @IsNumber()
  message_id!: number;

  @IsObject()
  application!: {
    application_id: string;
    application_type: 'mobile' | 'speaker' | 'other';
  };

  @IsObject()
  user?: {
    /**
     * скилл + аккаунт.
     */
    user_id: string;

    vk_user_id?: number;
  };
}

export class MarusyaState {
  @IsObject()
  session!: {
    wait?: MarusyaWaitState;
    taskId?: string;
    taskState?: MarusyaTaskState;
  };

  @IsObject()
  user!: {
    list?: number;
  };
}

export class MarusyaAsk {
  @IsObject()
  @ValidateNested()
  @Type(() => MarusyaMeta)
  meta!: MarusyaMeta;

  @IsObject()
  @ValidateNested()
  @Type(() => MarusyaRequest)
  request!: MarusyaRequest;

  @IsObject()
  @ValidateNested()
  @Type(() => MarusyaSession)
  session!: MarusyaSession;

  @IsObject()
  @ValidateNested()
  @Type(() => MarusyaState)
  state!: MarusyaState;

  /**
   * 1.0
   */
  @IsString()
  version!: string;
}

export type MarusyaResponse = {
  response: {
    /**
     * max 1024
     */
    text: string | string[];
    /**
     * max 1024
     */
    tts?: string;

    buttons?: MarusyaButton[];

    /**
     * Признак конца разговора:
     *  true — сессию следует завершить,
     *  false — сессию следует продолжить.
     */
    end_session: boolean;

    card?: MarusyaCards;
  };
  session: {
    session_id: string;
    user_id: string;
    message_id: number;
  };
  version: '1.0';
  session_state?: {
    wait?: MarusyaWaitState;
    taskState?: MarusyaTaskState;
    taskId?: string;
  };
  user_state_update?: {
    list?: number;
  };
};

export type MarusyaButton = {
  title: string;
  payload?: {};
  url?: string;
};

export type MarusyaCards =
  | {
      type: 'BigImage';
      /**
       * ID изображения из раздела Медиа-файлы в настройках скилла.
       */
      image_id: number;
    }
  | {
      type: 'ItemsList';
      /**
       * Список изображений, каждый элемент которого является объектом с обязательным полем image_id.
       */
      items: { image_id: number }[];
    }
  | {
      type: 'MiniApp';
      url: string;
    }
  | {
      type: 'Link';
      url: string;
      title: string;
      text: string;
      image_id: number;
    };
