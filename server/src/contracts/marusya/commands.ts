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
  // TODO
  WaitForReactionAfterNoTaskFound = 'WaitForReactionAfterNoTaskFound'
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
