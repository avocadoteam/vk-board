export enum MarusyaCommand {
  Create = 'созда',
  My = 'мо',
  Show = 'покажи',
  Task = 'задач',
}

export enum MarusyaWaitState {
  WaitForTaskName = 'WaitForTaskName',
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
export enum MarusyaTaskState {
  create = 'create',
  update = 'update'
}
