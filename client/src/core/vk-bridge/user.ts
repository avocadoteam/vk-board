import { vkBridge } from './instance';
import { Skeys } from 'core/models';

export const getUserData = () => vkBridge.send('VKWebAppGetUserInfo');

export const getUserStorageKeys = () =>
  vkBridge.send('VKWebAppStorageGet', {
    keys: [Skeys.appUser, Skeys.userSelectedListId],
  });

export const setStorageValue = (key: Skeys, value: string) =>
  vkBridge.send('VKWebAppStorageSet', { key, value });
