import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error
        console.error('Error caught by ErrorBoundary:', error, errorInfo);

        // Store error details
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // You can also log the error to an error reporting service here
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: error.toString(),
                fatal: false
            });
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-background px-4">
                    <div className="text-center">
                        <div className="mb-8">
                            <span className="text-6xl">😞</span>
                        </div>
                        <h1 className="text-3xl font-bold text-text-primary mb-4">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-text-secondary mb-8 max-w-md mx-auto">
                            We apologize for the inconvenience. An unexpected error has occurred.
                        </p>

                        {/* Show error details in development */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mb-8 text-left">
                                <summary className="cursor-pointer text-text-muted hover:text-text-secondary mb-2">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="bg-surface p-4 rounded-lg text-xs text-red-400 overflow-auto max-h-64">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={this.handleReload}
                                className="inline-block px-6 py-3 bg-customer-primary text-white rounded-lg hover:bg-customer-primary-hover transition-colors"
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="inline-block px-6 py-3 bg-surface text-text-primary rounded-lg hover:bg-surface-elevated transition-colors ml-4"
                            >
                                Go Home
                            </button>
                        </div>

                        <p className="mt-8 text-text-muted text-sm">
                            If this problem persists, please contact our support team.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;