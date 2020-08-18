import { IsString, Length, IsNotEmpty, IsNumber } from 'class-validator';

export class NewListModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 512)
  name!: string;
}

export class DropMembershipModel {
  @IsNumber()
  listId!: number;

  @IsNumber()
  userId!: number;
}
