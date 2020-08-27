import { vkBridge } from './instance';
import { Skeys, appId, premiumPrice, payToGroupId } from 'core/models';

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
    action: 'pay-to-group',
    params: { group_id: payToGroupId, amount: premiumPrice },
  });

export const getAddToHomeInfo = () => vkBridge.send('VKWebAppAddToHomeScreenInfo');

export const addToHome = () => vkBridge.send('VKWebAppAddToHomeScreen');
