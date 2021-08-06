import React from 'react';
import { Group, Div, Text, Spinner } from '@vkontakte/vkui';
import { useFela } from 'react-fela';
import { ListShareRabbit } from 'assets/svg/ListShareRabbit';
import { useSelector, useDispatch } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import { Button } from 'atoms/Button';
import { AppDispatchActions, FetchingStateName, MainView } from 'core/models';
import { isSaveMembershipUpdating, getPreviewMembershipData } from 'core/selectors/membership';
import { replace, getSearch } from 'connected-react-router';
import { isPlatformIOS } from 'core/selectors/settings';

export const MembershipPreview = React.memo(() => {
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);
  const updating = useSelector(isSaveMembershipUpdating);
  const { name } = useSelector(getPreviewMembershipData);
  const dispatch = useDispatch<AppDispatchActions>();
  const search = useSelector(getSearch);

  const accept = React.useCallback(() => {
    dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.SaveMembership });
  }, [dispatch]);

  const goToMain = React.useCallback(() => {
    if (isPlatformIOS()) {
      dispatch({ type: 'SET_MAIN_VIEW', payload: MainView.Board });
    } else {
      dispatch(replace(`/${search}`) as any);
    }
  }, [dispatch, search]);

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
          <ListShareRabbit
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
          Ваш друг приглашает Вас в список «{name}»
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
          Принять приглашение или нет? Выбор за Вами.
        </Text>
        <span className={css({ padding: '0 25px', display: 'flex', marginBottom: '.5rem' })}>
          <Button
            mode="primary"
            stretched
            square
            onClick={accept}
            disabled={updating}
            before={updating ? <Spinner /> : null}
          >
            Принять
          </Button>
        </span>
        <span className={css({ padding: '0 25px', display: 'flex' })}>
          <Button
            mode="tertiary"
            stretched
            square
            className={css({ color: dark ? '#858585 !important' : '#6A6A6A !important' })}
            onClick={goToMain}
            disabled={updating}
          >
            Закрыть
          </Button>
        </span>
      </Div>
    </>
  );
});
