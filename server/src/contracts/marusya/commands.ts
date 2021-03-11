export enum MarusyaCommand {
  Create = 'созда',
  My = 'мо',
  Show = 'покажи',
  Task = 'задач',
  Finish = 'заверш',
  Stop = 'cтоп',
  Exit = 'выход',
  Interrupt = 'on_interrupt'
}

export enum MarusyaWaitState {
  WaitForTaskName = 'WaitForTaskName',
  WaitForTaskNameToFinish = 'WaitForTaskNameToFinish',
  WaitForChangeTaskName = 'WaitForChangeTaskName',
  WaitForUserChoise = 'WaitForUserChoise',
  WaitForDescription = 'WaitForDescription',
  WaitForTime = 'WaitForTime',
  WaitForShowTaskInfo = 'WaitForShowTaskInfo',
}

export enum MarusyaUserChoise {
  description = 'description',
  name = 'name',
  time = 'time',
  end = 'end',
}
export enum MarusyaUserChoiseVoice {
  description = 'описание',
  name = 'название',
  time = 'время',
  end = 'нет',
}
export enum MarusyaTaskState {
  create = 'create',
  update = 'update'
}
