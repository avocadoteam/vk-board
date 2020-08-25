import { OS } from '@vkontakte/vkui';

export const getOrigin = window.location.origin;

export const errMap = (error: any) =>
  JSON.stringify(error, [
    'message',
    'arguments',
    'type',
    'name',
    'error_type',
    'error_data',
    'statusCode',
    'stack',
  ]);

export const platform = () => (/android/i.test(navigator.userAgent) ? OS.ANDROID : OS.IOS);
