import React from 'react';
import { CellButton } from 'atoms/CellButton';
import { useSelector, useDispatch } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import { useFela } from 'react-fela';
import { getNewTaskValues } from 'core/selectors/board';
import { AppDispatchActions } from 'core/models';
import { getNotifications } from 'core/selectors/settings';
import Icon28NotificationDisableOutline from '@vkontakte/icons/dist/28/notification_disable_outline';
import { vkBridge } from 'core/vk-bridge/instance';
import { getNewTaskInfo } from 'core/selectors/task';

type Props = {
  updateModalHeight: () => void;
};

export const NewTaskNotification = React.memo<Props>(({ updateModalHeight }) => {
  const { css } = useFela();
  const notifyEnabled = useSelector(getNotifications);
  const [notifyRequest, setRequest] = React.useState(false);
  const dark = useSelector(isThemeDrak);
  const formValues = useSelector(getNewTaskValues);
  const dispatch = useDispatch<AppDispatchActions>();
  const { updating } = useSelector(getNewTaskInfo);

  React.useEffect(() => {
    if (!!formValues.dueDate) {
      updateModalHeight();
    }
  }, [formValues.dueDate]);

  const changeNotificationsPermission = async () => {
    setRequest(true);
    try {
      if (!notifyEnabled && !notifyRequest) {
        const enabled = await vkBridge.send('VKWebAppAllowNotifications');
        dispatch({ type: 'SET_NOTIFICATIONS', payload: enabled.result });
      }
    } catch (_) {}

    setRequest(false);
  };

  const onToggle = () => {
    if (!notifyEnabled) {
      changeNotificationsPermission().then(() =>
        dispatch({
          type: 'UPDATE_NEW_TASK',
          payload: { name: 'notification', value: notifyEnabled },
        })
      );
    } else {
      dispatch({
        type: 'UPDATE_NEW_TASK',
        payload: { name: 'notification', value: !formValues.notification },
      });
    }
  };

  if (!formValues.dueDate) {
    return null;
  }

  return (
    <CellButton
      className={css({
        paddingLeft: '22px !important',
        color: formValues.notification
          ? '#42A4FF !important'
          : dark
          ? '#5F5F5F !important'
          : '#CFCFCF !important',
      })}
      onClick={onToggle}
      disabled={notifyRequest || updating}
    >
      {formValues.notification ? (
        <Icon28Notifications
          width={20}
          height={20}
          className={css({
            marginRight: '1rem',
          })}
        />
      ) : (
        <Icon28NotificationDisableOutline
          width={20}
          height={20}
          className={css({
            marginRight: '1rem',
          })}
        />
      )}
      Напомните мне
    </CellButton>
  );
});
