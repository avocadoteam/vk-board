import { MembershipItem } from './membership';

export type BoardListItem = {
  listguid: string;
  name: string;
  id: number;
  created: string;
  createdBy: number;
  memberships: MembershipItem[];
};

export type BoardTaskItem = {
  name: string;
  description: string | null;
  id: string;
  created: string;
  dueDate: string | null;
  finished: string | null;
  deleted: null;
  memberships: MembershipItem[];
};

export type TaskInfo = Pick<BoardTaskItem, 'id' | 'dueDate' | 'name' | 'description'>;

export type BoardState = {
  boardListName: string;
  firstBoardListName: string;
  editBoardListName: string;
  boardListOpenId: number;
  boardListToDeleteId: number;
  selectedList: {
    id: number;
    data: BoardListItem;
    tasks: BoardTaskItem[];
  };
  newTask: {
    name: string;
    description: string | null;
    dueDate: string | null;
  };
  tasksToBeFinished: string[];
  tasksToBeUnfinished: string[];
  tasksToBeFinishedTimer: number;
  selectedTask: TaskInfo;
  editedTask: TaskInfo;
};

export type NewTaskModel = {
  name: string;
  description: string;
  dueDate: string | null;
  listId: number;
};

export type EditTaskModel = {
  id: string;
} & NewTaskModel;
