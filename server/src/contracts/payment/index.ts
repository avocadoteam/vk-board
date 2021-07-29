import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';
import { IsNotBlank } from 'src/interceptors/exts/isBlank';

export enum NotificationType {
  GetItem = 'get_item', //— получение информации о товаре;
  GetItemTest = 'get_item_test', //— получение информации о товаре;
  OrderStatusChange = 'order_status_change', // — изменение статуса заказа;
  OrderStatusChangeTest = 'order_status_change_test', // — изменение статуса заказа;
  GetSub = 'get_subscription', // — получение информации о подписке;
  SubChange = 'subscription_status_change', // — изменение статуса подписки.
}

export class PaymentVoice {
  @IsEnum(NotificationType)
  notification_type: NotificationType;

  @IsNumber()
  app_id: number;
  @IsNumber()
  user_id: number;
  @IsNumber()
  receiver_id: number;

  @ValidateIf((o) => !o.subscription_id)
  @IsNumber()
  order_id: number;

  @ValidateIf((o) => !o.order_id)
  @IsNumber()
  subscription_id: number;

  @IsString()
  @IsNotBlank()
  version: string;

  @IsString()
  @IsNotBlank()
  sig: string;

  date: number;
  status: 'chargeable' | 'refunded';
  item: string;
  item_id: number;
  item_title: string;
  item_photo_url: string;
  item_price: string;
  item_discount: string;
}
