import React from 'react';
import { SimpleCell } from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import { Skeys, AppUser } from 'core/models';
import { getUserId } from 'core/selectors/user';
import { setStorageValue } from 'core/vk-bridge/user';

export const ResetW = React.memo(() => {
  const canShow = useSelector(getUserId) === 11437372;
  if (!canShow) {
    return null;
  }
  return <SimpleCell onClick={() => setStorageValue(Skeys.appUser, AppUser.No)}>Reset</SimpleCell>;
});
