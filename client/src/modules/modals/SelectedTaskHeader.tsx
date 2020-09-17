import { Div, Header } from '@vkontakte/vkui';
import { getSelectedTaskInfo } from 'core/selectors/task';
import React from 'react';
import { useFela } from 'react-fela';
import { useSelector } from 'react-redux';


export const SelectedTaskHeader = React.memo(() => {
  const { css } = useFela();
  const info = useSelector(getSelectedTaskInfo);

  return (
    <Div>
      <Header
        className={`useMonrope manropeBold ${css({
          textAlign: 'left',
          '>div>div': { fontSize: '20px !important' },
          userSelect: 'none',
        } as any)}`}
      >
        {info.name}
      </Header>
    </Div>
  );
});
