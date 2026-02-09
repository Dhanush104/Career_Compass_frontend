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
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="max-w-7xl mx-auto p-6">
                    <div className="card p-6 text-center">
                        <h2 className="text-xl font-bold text-error-600 mb-2">Something went wrong</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                            We're experiencing technical difficulties. Please try refreshing the page.
                        </p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="btn btn-primary"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
