import { IsString, Length, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class NewListModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  name!: string;
}

export class DropMembershipModel {
  @IsNumber()
  listId!: number;

  @IsNumber()
  userId!: number;
}

export class EditListModel extends NewListModel {
  @IsNumber()
  listId!: number;
}

export class CreateMembershipModel {
  @IsNumber()
  listId!: number;
}

export class PreviewMembershipModel {
  @IsUUID()
  guid!: string;
}