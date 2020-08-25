import {
  IsString,
  Length,
  IsNumber,
  IsNotEmpty,
  ValidateIf,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class NewTaskModel {
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

export class FinishTasksModel {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  taskIds!: number[];

  @IsNumber()
  listId!: number;
}

export class UpdateTaskModel extends NewTaskModel {
  @IsString()
  @IsNotEmpty()
  id!: number;
}
