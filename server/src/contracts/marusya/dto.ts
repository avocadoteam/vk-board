export type MarusyaAsk = {
  meta: {
    client_id: string;
    /**
     * ru_RU
     */
    locale: string;
    /**
     * 'Europe/Prague'
     */
    timezone: string;
    interfaces: {
      screen: {};
    };
    _city_ru: string;
  };

  request: {
    /**
     * stuff умения
     */
    command: string;
    original_utterance: string;
    nlu: {
      tokens: string[];
      entities: string[];
    };
  };

  session: {
    session_id: string;
    skill_id: string;
    new: boolean;
    message_id: number;
    application: {
      application_id: string;
      application_type: 'mobile' | 'speaker' | 'other';
    };

    user?: {
      /**
       * скилл + аккаунт.
       */
      user_id: string;
    };
  };

  state: {
    session: {};
    user: {};
  };

  /**
   * 1.0
   */
  version: string;
};

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

    buttons?: {
      title: string;
      payload?: {};
      url?: string;
    }[];

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
