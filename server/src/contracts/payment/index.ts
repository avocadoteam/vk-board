import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class NewPaymentModel {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  amount!: string;
}
