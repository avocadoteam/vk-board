import React from 'react';
import { Button as VkButton } from '@vkontakte/vkui';
import { useFela, CssFelaStyle } from 'react-fela';
import { ButtonProps } from '@vkontakte/vkui/dist/components/Button/Button';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';

type Props = {
  square?: boolean;
} & ButtonProps;

export const Button: React.FC<Props> = ({ square = false, ...props }) => {
  const dark = useSelector(isThemeDrak);
  const { css } = useFela<{}, StyleProps>({
    square,
    mode: props.mode,
    dark,
  });
  return <VkButton {...props} className={`useMonrope ${props.className ?? ''} ${css(btnStyle)}`} />;
};

type StyleProps = {
  dark: boolean;
} & Pick<Props, 'square' | 'mode'>;

const btnStyle: CssFelaStyle<{}, StyleProps> = ({ dark = false, mode, square }) => ({
  height: square ? '48px' : undefined,
  borderRadius: square ? '12px' : '37px',
  backgroundColor: bgByMode(mode, dark),
  color: colorByMode(mode, dark),
});

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
