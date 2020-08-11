import {
  IsString,
  Length,
  IsNumber,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class NewTaskModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 1024)
  name!: string;

  @IsNumber()
  listId!: number;

  @ValidateIf((o) => o.dueDate !== null)
  @IsNotEmpty()
  @IsString()
  @Length(1, 1024)
  dueDate!: string | null;
}
