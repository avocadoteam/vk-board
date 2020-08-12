import React from 'react';
import { Button as VkButton } from '@vkontakte/vkui';
import { useFela } from 'react-fela';
import { ButtonProps } from '@vkontakte/vkui/dist/components/Button/Button';
export const Button: React.FC<ButtonProps> = (props) => {
  const { css } = useFela();
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
          props.mode === 'secondary'
            ? '#42A4FF'
            : props.mode === 'tertiary'
            ? '#42A4FF'
            : undefined,
      })}`}
    />
  );
};
