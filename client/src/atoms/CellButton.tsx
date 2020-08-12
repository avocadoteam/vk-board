import React from 'react';
import { CellButton as VkCellButton } from '@vkontakte/vkui';
import { useFela } from 'react-fela';
import { CellButtonProps } from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
export const CellButton: React.FC<CellButtonProps> = (props) => {
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);

  return (
    <VkCellButton
      {...props}
      className={`useMonrope ${props.className ?? ''} ${css({
        color: dark ? '#fff' : '#000',
        '>div>div': {
          fontSize: '15px !important',
          fontWeight: 500,
        },
        '&.CellButton.Tappable--active': {
          backgroundColor: 'rgba(66, 164, 255, 0.1) !important',
          color: '#42A4FF !important',
        },
        paddingLeft: '23px',
        paddingRight: '23px',
      } as any)}`}
    />
  );
};
