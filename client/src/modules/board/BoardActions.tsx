import React from 'react';
import { Div, Group, Button } from '@vkontakte/vkui';
import Icon24List from '@vkontakte/icons/dist/24/list';
import Icon24Add from '@vkontakte/icons/dist/24/add';
export const BoardActions = React.memo(() => {
  return (
    <Div>
      <Group>
        <Button mode="primary" size="xl" stretched before={<Icon24Add />}>
          Новая задача
        </Button>
        <Button mode="tertiary">
          <Icon24List />
        </Button>
      </Group>
    </Div>
  );
});
