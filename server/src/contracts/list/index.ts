import { IsString, Length, IsNotEmpty } from 'class-validator';

export class NewListModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 512)
  name!: string;
}
