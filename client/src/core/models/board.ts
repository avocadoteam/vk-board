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
  description: string;
  id: number;
  created: string;
  dueDate: string | null;
  taskGUID: string;
  finished: string | null;
  deleted: null;
  memberships: MembershipItem[];
};

export type TaskInfo = Pick<BoardTaskItem, 'id' | 'dueDate' | 'name' | 'description' | 'taskGUID'>;

export type BoardState = {
  boardListName: string;
  editBoardListName: string;
  boardListOpenId: number;
  boardListToDeleteId: number;
  selectedList: {
    id: number;
    data: BoardListItem;
    tasks: BoardTaskItem[]
  };
  newTask: {
    name: string;
    description: string;
    dueDate: string | null;
  };
  tasksToBeFinished: number[];
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
  id: number;
} & NewTaskModel;
