import React from 'react';
import { Group, Div, Text, Spinner } from '@vkontakte/vkui';
import { useFela } from 'react-fela';
import { ListShareRabbit } from 'assets/svg/ListShareRabbit';
import { useSelector, useDispatch } from 'react-redux';
import { isThemeDrak } from 'core/selectors/common';
import { Button } from 'atoms/Button';
import { AppDispatchActions, FetchingStateName } from 'core/models';
import {
  isSaveMembershipUpdating,
  getPreviewMembershipData,
  isSaveMembershipReady,
} from 'core/selectors/membership';

type Props = {
  handleBack: () => void;
};

export const MembershipPreview = React.memo<Props>(({ handleBack }) => {
  const { css } = useFela();
  const dark = useSelector(isThemeDrak);
  const updating = useSelector(isSaveMembershipUpdating);
  const ready = useSelector(isSaveMembershipReady);
  const { name } = useSelector(getPreviewMembershipData);
  const dispatch = useDispatch<AppDispatchActions>();

  React.useEffect(() => {
    if (ready) {
      handleBack()
    }
  }, [ready])

  const accept = React.useCallback(() => {
    dispatch({ type: 'SET_UPDATING_DATA', payload: FetchingStateName.SaveMembership });
  }, [dispatch]);

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
            onClick={handleBack}
            disabled={updating}
          >
            Закрыть
          </Button>
        </span>
      </Div>
    </>
  );
});
