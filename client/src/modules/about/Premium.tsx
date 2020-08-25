import React from 'react';
import { Div, Text } from '@vkontakte/vkui';
import { useFela, CssFelaStyle } from 'react-fela';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import { appV } from 'core/models';
import { Notifications } from './Notifications';
import { PremiumCard } from './PremiumCard';

export const Premium = React.memo(() => {
  const dark = useSelector(isThemeDrak);
  const { css } = useFela({ dark });

  return (
    <Div>
      <PremiumCard />
      <Notifications />
      <Text
        weight="medium"
        className={`useMonrope ${css(textStyle, {
          fontSize: '12px',
          lineHeight: '16px',
          color: dark ? '#5F5F5F' : '#CFCFCF',
          marginTop: '25px',
          textAlign: 'center',
        })}`}
      >
        Версия {appV}, avocado
      </Text>
    </Div>
  );
});

const textStyle: CssFelaStyle<{}, { dark: boolean }> = ({ dark }) => ({
  color: dark ? '#FFF !important' : '#000 !important',
});
