export type BoardListIiem = {
  name: string;
  id: number;
  created: string;
  tasks: BoardTaskItem[];
};

export type BoardTaskItem = {
  name: string;
  id: number;
  created: string;
  dueDate: string | null;
  taskGUID: string;
  finished: string | null;
  deleted: null;
};

export type BoardState = {
  selectedBoardListId: number;
}