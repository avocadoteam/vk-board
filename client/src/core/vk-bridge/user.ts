import { vkBridge } from './instance';
import { Skeys, appId, payToUserId, premiumPrice } from 'core/models';

export const getUserData = () => vkBridge.send('VKWebAppGetUserInfo');

export const getUserStorageKeys = () =>
  vkBridge.send('VKWebAppStorageGet', {
    keys: [Skeys.appUser, Skeys.userSelectedListId],
  });

export const setStorageValue = (key: Skeys, value: string) =>
  vkBridge.send('VKWebAppStorageSet', { key, value });

export const buyPremium = () =>
  vkBridge.send('VKWebAppOpenPayForm', {
    app_id: appId,
    action: 'pay-to-user',
    params: { user_id: payToUserId, amount: premiumPrice },
  });
