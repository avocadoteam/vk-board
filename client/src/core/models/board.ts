export type BoardListIiem = {
  name: string;
  id: number;
  created: string;
  tasks: BoardTaskItem[];
};

export type BoardTaskItem = {
  name: string;
  description: string;
  id: number;
  created: string;
  dueDate: string | null;
  taskGUID: string;
  finished: string | null;
  deleted: null;
  memberships: MembershipItem[];
};

export type MembershipItem = {
  avatar: string;
  userId: number;
};

export type BoardState = {
  selectedBoardListId: number;
  newTask: {
    name: string;
    description: string;
    dueDate: string | null;
  };
  tasksToBeFinished: number[];
};

export type NewTaskModel = {
  name: string;
  description: string;
  dueDate: string | null;
  listId: number;
};
