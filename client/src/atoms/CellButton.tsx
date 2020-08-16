import React, { ButtonHTMLAttributes } from 'react';
import { useFela, CssFelaStyle } from 'react-fela';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};
export const CellButton: React.FC<Props> = ({ className = '', selected = false, ...props }) => {
  const dark = useSelector(isThemeDrak);
  const { css } = useFela({ dark, selected });

  return <button {...props} className={`useMonrope ${css(cellButtonStyle)} ${className}`} />;
};

const cellButtonStyle: CssFelaStyle<
  {},
  {
    dark: boolean;
    selected: boolean;
  }
> = ({ dark, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  outline: 0,
  textDecoration: 'none',
  margin: 0,
  padding: 0,
  border: 0,
  cursor: 'pointer',
  width: '100%',
  background: '0 0',
  position: 'relative',
  color: dark ? '#fff' : '#000',
  fontSize: '16px',
  fontWeight: 500,
  ':active': {
    backgroundColor: 'rgba(66, 164, 255, 0.1) !important',
    color: '#42A4FF !important',
  },
  paddingLeft: '23px',
  paddingRight: '23px',
  transition: 'background-color .15s ease-out',
  lineHeight: '20px',
  height: '50px',
  textAlign: 'left',
  ...(selected
    ? {
        backgroundColor: 'rgba(66, 164, 255, 0.1) !important',
        color: '#42A4FF !important',
      }
    : {}),
});
