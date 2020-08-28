import {
  IsString,
  Length,
  IsNumber,
  IsNotEmpty,
  ValidateIf,
  IsArray,
  ArrayMinSize,
  IsBoolean,
} from 'class-validator';

export class UpdateTaskNotification {
  @IsBoolean()
  notification!: boolean;
  
  @IsString()
  @IsNotEmpty()
  taskId!: string;

  @IsNumber()
  listId!: number;
}
export class GeneralTaskModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  name!: string;

  @ValidateIf((o) => o.description !== null)
  @IsString()
  @IsNotEmpty()
  @Length(1, 1024)
  description!: string | null;

  @IsNumber()
  listId!: number;

  @ValidateIf((o) => o.dueDate !== null)
  @IsNotEmpty()
  @IsString()
  @Length(1, 1024)
  dueDate!: string | null;
}

export class NewTaskModel extends GeneralTaskModel {
  @IsBoolean()
  notification!: boolean;
}

export class FinishTasksModel {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  taskIds!: string[];

  @IsNumber()
  listId!: number;
}

export class UpdateTaskModel extends GeneralTaskModel {
  @IsString()
  @IsNotEmpty()
  id!: string;
}

export class DeleteTaskModel {
  @IsString()
  @IsNotEmpty()
  taskId!: string;

  @IsNumber()
  listId!: number;
}

export type BoardTaskItem = {
  name: string;
  description: string | null;
  id: string;
  created: string;
  dueDate: string | null;
  finished: string | null;
  deleted: null;
  notificationUserId: number;
};

export type TaskInfo = Pick<
  BoardTaskItem,
  'id' | 'dueDate' | 'name' | 'description'
>;
