import React from 'react';
import { SimpleCell, Switch, Div, Subhead } from '@vkontakte/vkui';
import { useFela } from 'react-fela';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications } from 'core/selectors/settings';
import { vkBridge } from 'core/vk-bridge/instance';
import { AppDispatchActions } from 'core/models';

export const Notifications = React.memo(() => {
  const { css } = useFela();
  const notifyEnabled = useSelector(getNotifications);
  const [notifyRequest, setRequest] = React.useState(false);
  const dispatch = useDispatch<AppDispatchActions>();

  const handleToggle = async (
    e: React.MouseEvent<HTMLElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    setRequest(true);
    try {
      if (!notifyEnabled && !notifyRequest) {
        const enabled = await vkBridge.send('VKWebAppAllowNotifications');
        dispatch({ type: 'SET_NOTIFICATIONS', payload: enabled.result });
      } else if (notifyEnabled && !notifyRequest) {
        const disabled = await vkBridge.send('VKWebAppDenyNotifications');
        if (disabled.result) {
          dispatch({ type: 'SET_NOTIFICATIONS', payload: false });
        }
      }
    } catch (_) {}

    setRequest(false);
  };
  return (
    <>
      <SimpleCell
        disabled
        after={<Switch onChange={handleToggle} checked={notifyEnabled} />}
        onClick={handleToggle}
      >
        Уведомления
      </SimpleCell>
      <Div>
        <Subhead weight="regular" className={css({ color: '#818C99', margin: 0 })}>
          Мы будем присылать уведомление за день до срока выполнения задачи. Учитываются задачи, на
          которые вы подписались.
        </Subhead>
      </Div>
    </>
  );
});
