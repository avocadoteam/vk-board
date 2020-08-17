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
        backgroundColor: bgByMode(props.mode, dark),
        color: colorByMode(props.mode, dark),
      })}`}
    />
  );
};

const bgByMode = (mode: ButtonProps['mode'], dark: boolean) => {
  switch (mode) {
    case 'overlay_outline':
      return dark ? '#28292D' : '#F9F9F9';
    case 'primary':
      return '#42A4FF';
    case 'secondary':
      return 'rgba(66, 164, 255, 0.1)';
    case 'destructive':
      return 'rgba(255, 72, 72, 0.1)';

    default:
      return undefined;
  }
};
const colorByMode = (mode: ButtonProps['mode'], dark: boolean) => {
  switch (mode) {
    case 'overlay_outline':
      return '#959595';
    case 'primary':
      return dark ? '#222327' : undefined;
    case 'secondary':
    case 'tertiary':
      return '#42A4FF';
    case 'destructive':
      return '#FF4848';

    default:
      return undefined;
  }
};
