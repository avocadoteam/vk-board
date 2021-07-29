import { Skeys } from 'core/models';
import { vkBridge } from './instance';

export const getUserData = () => vkBridge.send('VKWebAppGetUserInfo');

export const getUserStorageKeys = () =>
  vkBridge.send('VKWebAppStorageGet', {
    keys: [Skeys.appUser, Skeys.userSelectedListId],
  });

export const setStorageValue = (key: Skeys, value: string) =>
  vkBridge.send('VKWebAppStorageSet', { key, value });

export const getAddToHomeInfo = () => vkBridge.send('VKWebAppAddToHomeScreenInfo');

export const addToHome = () => vkBridge.send('VKWebAppAddToHomeScreen');
