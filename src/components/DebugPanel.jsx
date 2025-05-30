import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Code, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';

const DebugPanel = () => {
    const { messages, extractedData, getCompletionScore, debugInfo } = useApp();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showRawData, setShowRawData] = useState(false);

    const completionScore = getCompletionScore();

    // Only show in development or when there's data to debug
    const shouldShow = process.env.NODE_ENV === 'development' || messages.length > 0;

    if (!shouldShow) return null;

    return (
        <div className="card">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Code className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Debug Panel</h3>
                        <p className="text-sm text-gray-500">Financial data extraction testing</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                        {completionScore}% complete
                    </span>
                    {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="mt-6 space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-blue-700">Messages</div>
                            <div className="text-2xl font-bold text-blue-900">{messages.length}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-green-700">Income Items</div>
                            <div className="text-2xl font-bold text-green-900">{extractedData.income?.length || 0}</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-red-700">Expenses</div>
                            <div className="text-2xl font-bold text-red-900">{extractedData.expenses?.length || 0}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-purple-700">Goals</div>
                            <div className="text-2xl font-bold text-purple-900">{extractedData.goals?.length || 0}</div>
                        </div>
                    </div>

                    {/* Data Quality Check */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Data Quality</h4>
                        <div className="space-y-2">
                            {extractedData.income?.length > 0 && (
                                <div className="text-sm">
                                    <span className="text-green-600">✓</span> Income data detected
                                </div>
                            )}
                            {extractedData.expenses?.length > 0 && (
                                <div className="text-sm">
                                    <span className="text-green-600">✓</span> Expense data detected
                                </div>
                            )}
                            {extractedData.goals?.length > 0 && (
                                <div className="text-sm">
                                    <span className="text-green-600">✓</span> Goals detected
                                </div>
                            )}
                            {extractedData.riskTolerance && (
                                <div className="text-sm">
                                    <span className="text-green-600">✓</span> Risk tolerance assessed
                                </div>
                            )}
                            {!extractedData.income?.length && (
                                <div className="text-sm">
                                    <span className="text-gray-400">○</span> No income data yet
                                </div>
                            )}
                            {!extractedData.expenses?.length && (
                                <div className="text-sm">
                                    <span className="text-gray-400">○</span> No expense data yet
                                </div>
                            )}
                            {!extractedData.goals?.length && (
                                <div className="text-sm">
                                    <span className="text-gray-400">○</span> No goals defined yet
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Raw Data Toggle */}
                    <div>
                        <button
                            onClick={() => setShowRawData(!showRawData)}
                            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                            {showRawData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span>{showRawData ? 'Hide' : 'Show'} Raw Data</span>
                        </button>

                        {showRawData && (
                            <div className="mt-4 space-y-4">
                                {/* Extracted Data */}
                                <div className="bg-gray-900 rounded-lg p-4">
                                    <h5 className="text-white font-medium mb-2">Extracted Data</h5>
                                    <pre className="text-xs text-green-400 overflow-auto max-h-64">
                                        {JSON.stringify(extractedData, null, 2)}
                                    </pre>
                                </div>

                                {/* Debug Info */}
                                {debugInfo && (
                                    <div className="bg-blue-900 rounded-lg p-4">
                                        <h5 className="text-white font-medium mb-2">Debug Info</h5>
                                        <pre className="text-xs text-blue-300 overflow-auto">
                                            {JSON.stringify(debugInfo, null, 2)}
                                        </pre>
                                    </div>
                                )}

                                {/* Recent Messages */}
                                {messages.length > 0 && (
                                    <div className="bg-purple-900 rounded-lg p-4">
                                        <h5 className="text-white font-medium mb-2">Recent Messages</h5>
                                        <div className="space-y-2 max-h-64 overflow-auto">
                                            {messages.slice(-5).map((message, index) => (
                                                <div key={index} className="text-xs">
                                                    <span className={`font-medium ${message.type === 'user' ? 'text-yellow-400' : 'text-cyan-400'
                                                        }`}>
                                                        {message.type === 'user' ? 'User' : 'AI'}:
                                                    </span>
                                                    <span className="text-gray-300 ml-2">
                                                        {typeof message.content === 'string'
                                                            ? message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')
                                                            : JSON.stringify(message.content)
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Test Phrases */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">Test Data Extraction</h4>
                        <p className="text-sm text-yellow-700 mb-3">
                            Try these phrases to test the financial data extraction:
                        </p>
                        <div className="text-xs text-yellow-600 space-y-1">
                            <div>"I earn £55k per year"</div>
                            <div>"My rent is £1200 per month"</div>
                            <div>"I want to buy a house in 3 years"</div>
                            <div>"I'm a conservative investor"</div>
                            <div>"I spend £2500 monthly on expenses"</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebugPanel;