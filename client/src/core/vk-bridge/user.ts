import { vkBridge } from './instance';
import { AppUser, appUserStorageKey } from 'core/models';

export const getUserData = () => vkBridge.send('VKWebAppGetUserInfo');

export const getIsAppUserFromStorage = () =>
  vkBridge.send('VKWebAppStorageGet', {
    keys: [appUserStorageKey],
  });

export const setIsAppUser = (value: AppUser) =>
  vkBridge.send('VKWebAppStorageSet', { key: appUserStorageKey, value });
