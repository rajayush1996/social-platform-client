import React from 'react';
import { Button } from '@/components/ui/button';

interface State { hasError: boolean; }
export class ErrorBoundary extends React.Component<React.PropsWithChildren<object>, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-6 opacity-75">An unexpected error occurred. Try refreshing the page.</p>
          <Button onClick={this.handleReload} className="bg-pink-500 hover:bg-pink-600">
            Reload
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
