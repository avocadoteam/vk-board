import React from 'react';
import { Button as VkButton } from '@vkontakte/vkui';
import { useFela } from 'react-fela';
import { ButtonProps } from '@vkontakte/vkui/dist/components/Button/Button';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
export const Button: React.FC<ButtonProps> = (props) => {
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);
  return (
    <VkButton
      {...props}
      className={`useMonrope ${props.className ?? ''} ${css({
        borderRadius: '37px',
        backgroundColor:
          props.mode === 'primary'
            ? '#42A4FF'
            : props.mode === 'secondary'
            ? 'rgba(66, 164, 255, 0.1)'
            : undefined,
        color:
          dark && props.mode === 'primary'
            ? '#222327'
            : props.mode === 'secondary'
            ? '#42A4FF'
            : props.mode === 'tertiary'
            ? '#42A4FF'
            : undefined,
      })}`}
    />
  );
};
