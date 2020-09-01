import { IsString, Length, IsNotEmpty, IsNumber, IsUUID, Min, Max } from 'class-validator';
import { int4 } from 'src/constants';

export class NewListModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  name!: string;
}

export class DropMembershipModel {
  @IsNumber()
  @Min(1)
  @Max(int4)
  listId!: number;

  @IsNumber()
  userId!: number;
}

export class EditListModel extends NewListModel {
  @IsNumber()
  @Min(1)
  @Max(int4)
  listId!: number;
}

export class CreateMembershipModel {
  @IsNumber()
  @Min(1)
  @Max(int4)
  listId!: number;
}

export class PreviewMembershipModel {
  @IsUUID()
  guid!: string;
}