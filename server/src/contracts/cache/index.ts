export const cacheKey = {
  boardList: (userId: string) => `board_list_${userId}`,
  tasks: (listId: string) => `tasks_${listId}`,
  canCreateList: (userId: number) => `${userId}_canCreateList`,
  canJoinList: (userId: number, listId: number) => `${userId}_canJoinList_${listId}`,
  hasPremium: (userId: number) => `${userId}_premium`,
  googleSync: (userId: number) => `getDurationOf24HoursBeforeNewSync_${userId}`
};

export const dayTTL = 60 * 60 * 24;