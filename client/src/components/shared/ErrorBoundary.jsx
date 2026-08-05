import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-900 text-white p-6">
          <div className="max-w-md w-full bg-surface-800 p-8 rounded-2xl border border-red-500/30 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Something went wrong</h2>
            <p className="text-surface-300 text-sm mb-4">
              {this.state.error?.toString() || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-xl font-medium text-sm transition"
            >
              Reset App & Return to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
