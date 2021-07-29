export enum NotificationType {
  GetItem = 'get_item', //— получение информации о товаре;
  GetItemTest = 'get_item_test', //— получение информации о товаре;
  OrderStatusChange = 'order_status_change', // — изменение статуса заказа;
  OrderStatusChangeTest = 'order_status_change_test', // — изменение статуса заказа;
  GetSub = 'get_subscription', // — получение информации о подписке;
  SubChange = 'subscription_status_change', // — изменение статуса подписки.
}

export class PaymentVoice {
  notification_type: NotificationType;

  app_id: number;
  user_id: number;
  receiver_id: number;

  order_id: number;

  subscription_id: number;

  version: string;

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
