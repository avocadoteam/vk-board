import React from 'react';
import { Group, Div, Text } from '@vkontakte/vkui';
import { useFela } from 'react-fela';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import { NoTasks } from 'assets/svg/NoTasks';
import { getSelectedList } from 'core/selectors/boardLists';

export const BoardEmpty = React.memo(() => {
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);
  const { tasks } = useSelector(getSelectedList);

  if (tasks.length) {
    return null;
  }

  return (
    <>
      <Group separator="hide" className={css({ height: '35vh' })}>
        <Div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          })}
        >
          <NoTasks
            className={css({
              display: 'flex',
              marginTop: 'auto',
              marginBottom: '30px',
              alignSelf: 'center',
            })}
          />
        </Div>
      </Group>
      <Div>
        <Text
          weight="semibold"
          className={`useMonrope ${css({
            fontSize: '20px',
            lineHeight: '25px',
            textAlign: 'center',
            padding: '0 44px',
            marginBottom: '14px',
          })}`}
        >
          Тут пусто
        </Text>
        <Text
          weight="medium"
          className={`useMonrope ${css({
            fontSize: '15px',
            lineHeight: '22px',
            textAlign: 'center',
            padding: '0 25px',
            marginBottom: '33px',
            color: dark ? '#858585' : '#6A6A6A',
          })}`}
        >
          Создайте задачу с помощью кнопки ниже.
        </Text>
      </Div>
    </>
  );
});
