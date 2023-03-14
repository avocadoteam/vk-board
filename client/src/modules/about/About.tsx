import React from 'react';
import { Div, Text, List } from '@vkontakte/vkui';
import { useFela, CssFelaStyle } from 'react-fela';
import { useSelector } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import { appV } from 'core/models';
import { Notifications } from './Notifications';
import { PremiumCard } from './PremiumCard';
import { AddToHomeScreen } from './AddToHomeScreen';
import { ResetW } from './ResetWelcome';

export const About = React.memo(() => {
  const dark = useSelector(isThemeDrak);
  const { css } = useFela({ dark });

  return (
    <Div>
      <PremiumCard />
      <List>
        <ResetW />
        <AddToHomeScreen />
        <Notifications />
      </List>
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
        Версия {appV},{' '}
        <a
          href="https://vk.com/avocado"
          target="_blank"
          className={css({
            color: 'inherit',
          })}
        >
          avocado
        </a>
      </Text>
    </Div>
  );
});

const textStyle: CssFelaStyle<{}, { dark: boolean }> = ({ dark }) => ({
  color: dark ? '#FFF !important' : '#000 !important',
});
