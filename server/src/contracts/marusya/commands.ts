export enum MarusyaCommand {
  Create = 'созда',
  My = 'мо',
  Show = 'покажи',
  List = 'список',
  Task = 'задач',
  Finish = 'заверш',
  Stop = 'cтоп',
  Exit = 'выход',
  Interrupt = 'on_interrupt',
}

export enum MarusyaWaitState {
  WaitForTaskName = 'WaitForTaskName',
  WaitForTaskNameToFinish = 'WaitForTaskNameToFinish',
  WaitForChangeTaskName = 'WaitForChangeTaskName',
  WaitForUserChoice = 'WaitForUserChoice',
  WaitForDescription = 'WaitForDescription',
  WaitForTime = 'WaitForTime',
  WaitForShowTaskInfo = 'WaitForShowTaskInfo',
  WaitForReactionAfterNoTaskFound = 'WaitForReactionAfterNoTaskFound',
}

export enum MarusyaUserChoice {
  description = 'description',
  name = 'name',
  time = 'time',
  end = 'end',
}

export enum MarusyaUserWelcomeChoice {
  create = 'создать задачу',
  end = 'завершить задачу',
  list = 'список задач',
}

export enum MarusyaUserChoiceVoice {
  description = 'описание',
  name = 'название',
  time = 'время',
  end = 'нет',
}

export enum MarusyaTaskState {
  create = 'create',
  update = 'update',
}

export enum UserWantsToken {
  Yes = 'да',
  Want = 'хочу',
  Wanted = 'хотел',
  Give = 'дава',
}
export const userWantsTokens = Object.values(UserWantsToken);
export enum UserNotWantToken {
  No = 'не',
  Want = 'не хочу',
  Wanted = 'не хотел',
  Need = 'не надо',
  Needed = 'не нужно',
}
export const userNotWantTokens = Object.values(UserNotWantToken);
