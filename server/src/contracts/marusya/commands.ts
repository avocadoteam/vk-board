export enum MarusyaCommand {
  Create = 'созда',
  My = 'мо',
  Show = 'покажи',
  Task = 'задач',
}

export enum MarusyaWaitState {
  WaitForTaskName = 'WaitForTaskName',
  WaitForUserChoise = 'WaitForUserChoise',
  WaitForDescription = 'WaitForDescription',
  WaitForTime = 'WaitForTime',
}

export enum MarusyaUserChoise {
  description = 'description',
  time = 'time',
  end = 'end',
}
