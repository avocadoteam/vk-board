import React from 'react';
import { PanelHeader, Group, Div, Title } from '@vkontakte/vkui';
import { AlienOffline } from 'assets/svg/AlienOffline';
import { captureException } from '@sentry/browser';
type LocalState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<unknown, LocalState> {
  state: LocalState = { hasError: false };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <PanelHeader separator={false} />
          <Group
            separator="hide"
            style={{
              height: '40vh',
            }}
          >
            <Div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <AlienOffline
                style={{
                  display: 'flex',
                  marginTop: 'auto',
                  marginBottom: '2rem',
                  alignSelf: 'center',
                }}
              />
            </Div>
          </Group>
          <Group separator="hide" style={{ textAlign: 'center' }}>
            <Title weight="bold" level="2" className="useMonrope manropeBold">
              Произошла ошибка
            </Title>
          </Group>
        </>
      );
    }

    return this.props.children;
  }
}
