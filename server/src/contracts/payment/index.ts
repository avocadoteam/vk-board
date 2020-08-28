import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PaymentPayload {
  @IsNumber()
  from_id!: number;

  @IsNumber()
  amount!: number;

  description?: string;
  date!: string;
}

export class PaymentCBModel {
  @IsString()
  @IsNotEmpty()
  type!: 'vkpay_transaction' | 'confirmation';

  @IsNumber()
  group_id!: number;

  @ValidateIf((o) => !!o.object)
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentPayload)
  object?: PaymentPayload;
}
