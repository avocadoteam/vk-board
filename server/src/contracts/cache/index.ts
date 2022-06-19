export const cacheKey = {
  boardList: (userId: string) => `board_list_${userId}`,
  tasks: (listId: string) => `tasks_${listId}`,
  googleSync: (userId: number) => `getDurationOf24HoursBeforeNewSync_${userId}`
};

export const dayTTL = 60 * 60 * 24;