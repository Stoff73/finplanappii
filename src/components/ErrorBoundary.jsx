import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="max-w-md mx-auto text-center">
                        <div className="card">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Something went wrong
                            </h2>
                            <p className="text-gray-600 mb-6">
                                The application encountered an unexpected error. This might be due to corrupted data or a browser issue.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="btn-primary w-full flex items-center justify-center space-x-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Reload Application</span>
                                </button>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('financialPlanningApp');
                                        window.location.reload();
                                    }}
                                    className="btn-secondary w-full"
                                >
                                    Clear Data & Reload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
