import { Allow } from 'class-validator';

export enum NotificationType {
  GetItem = 'get_item', //— получение информации о товаре;
  GetItemTest = 'get_item_test', //— получение информации о товаре;
  OrderStatusChange = 'order_status_change', // — изменение статуса заказа;
  OrderStatusChangeTest = 'order_status_change_test', // — изменение статуса заказа;
  GetSub = 'get_subscription', // — получение информации о подписке;
  SubChange = 'subscription_status_change', // — изменение статуса подписки.
}

export class PaymentVoice {
  @Allow()
  notification_type: NotificationType;
  @Allow()
  app_id: number;
  @Allow()
  user_id: number;
  @Allow()
  receiver_id: number;
  @Allow()
  order_id: number;
  @Allow()
  subscription_id: number;
  @Allow()
  version: string;
  @Allow()
  sig: string;
  @Allow()
  date: number;
  @Allow()
  status: 'chargeable' | 'refunded';
  @Allow()
  item: string;
  @Allow()
  item_id: number;
  @Allow()
  item_title: string;
  @Allow()
  item_photo_url: string;
  @Allow()
  item_price: string;
  @Allow()
  item_discount: string;
}
