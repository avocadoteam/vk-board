export const cacheKey = {
  boardList: (userId: string) => `board_list_${userId}`,
  membership: (userId: string, taskId: string) =>
    `${taskId}_task_membership_${userId}`,
  tasks: (userId: string, listId: string) => `${listId}_tasks_${userId}`,
};
