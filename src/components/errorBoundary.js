import { Button, Result } from 'antd';
import { withRouter } from 'next/router';
import React from 'react';

/**
 * Catches a rendering error in the page below it and offers a way out
 * instead of a blank screen. Resets when the visitor goes to another page.
 */
class ErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    // Visible in the browser console and to any error reporter attached to it.
    console.error('Page crashed', error, info?.componentStack);
  }

  componentDidUpdate(previous) {
    if (this.state.failed && previous.router.asPath !== this.props.router.asPath) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (!this.state.failed) {
      return this.props.children;
    }
    return (
      <Result
        style={{ marginTop: '120px' }}
        status="error"
        title="Что-то сломалось"
        subTitle="Ошибка на нашей стороне. Обновите страницу; если не поможет, вернитесь на главную."
        extra={[
          <Button key="reload" type="primary" onClick={() => window.location.reload()}>
            Обновить страницу
          </Button>,
          <Button key="home" onClick={() => this.props.router.push('/')}>
            На главную
          </Button>,
        ]}
      />
    );
  }
}

export default withRouter(ErrorBoundary);
