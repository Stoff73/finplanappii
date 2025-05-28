import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, TrendingUp, DollarSign, Shield, AlertCircle, RefreshCw } from 'lucide-react';

const DataSummary = () => {
    const { messages, extractedData, forceDataExtraction } = useApp();

    // Debug: Log current state
    useEffect(() => {
        console.log('DataSummary - Current messages:', messages);
        console.log('DataSummary - Current extractedData:', extractedData);
    }, [messages, extractedData]);

    const getSummaryCard = (type, data, icon, title, emptyMessage) => {
        const hasData = Array.isArray(data) ? data.length > 0 : data !== null;

        console.log(`Card ${type} - hasData: ${hasData}, data:`, data);

        return (
            <div key={type} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            {icon}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
                    </div>

                    {/* Debug button - remove in production */}
                    <button
                        onClick={() => {
                            console.log(`${type} data:`, data);
                            forceDataExtraction();
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600 p-1"
                        title="Debug & Refresh"
                    >
                        <RefreshCw className="w-3 h-3" />
                    </button>
                </div>

                {hasData ? (
                    <div className="space-y-3">
                        {type === 'income' && data.map((item, idx) => (
                            <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-100">
                                <p className="text-sm font-medium text-gray-800 mb-1">{item.text}</p>
                                {item.amounts && item.amounts.length > 0 && (
                                    <p className="text-lg font-bold text-green-600">
                                        £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                                {item.rawText && (
                                    <p className="text-xs text-gray-500 mt-1 italic">"{item.rawText}"</p>
                                )}
                            </div>
                        ))}

                        {type === 'expenses' && data.map((item, idx) => (
                            <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-100">
                                <p className="text-sm font-medium text-gray-800 mb-1">{item.text}</p>
                                {item.amounts && item.amounts.length > 0 && (
                                    <p className="text-lg font-bold text-red-600">
                                        £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                                {item.category && item.category !== 'expense' && (
                                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full mt-1">
                                        {item.category}
                                    </span>
                                )}
                                {item.rawText && (
                                    <p className="text-xs text-gray-500 mt-1 italic">"{item.rawText}"</p>
                                )}
                            </div>
                        ))}

                        {type === 'goals' && data.map((item, idx) => (
                            <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-sm font-medium text-gray-800 mb-1">{item.text}</p>
                                {item.type && item.type.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {item.type.map((goalType, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                {goalType}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {item.amounts && item.amounts.length > 0 && (
                                    <p className="text-lg font-bold text-blue-600 mt-2">
                                        Target: £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                                {item.timeframes && item.timeframes.length > 0 && (
                                    <p className="text-sm text-blue-600 mt-1">
                                        Timeline: {item.timeframes[0].value} {item.timeframes[0].unit}
                                    </p>
                                )}
                                {item.rawText && (
                                    <p className="text-xs text-gray-500 mt-1 italic">"{item.rawText}"</p>
                                )}
                            </div>
                        ))}

                        {type === 'risk' && (
                            <div className={`p-3 rounded-lg border ${data.level === 'low' ? 'bg-green-50 border-green-100' :
                                    data.level === 'high' ? 'bg-red-50 border-red-100' :
                                        'bg-yellow-50 border-yellow-100'
                                }`}>
                                <p className="text-sm font-medium text-gray-800 mb-1">{data.text}</p>
                                <p className={`text-lg font-bold ${data.level === 'low' ? 'text-green-600' :
                                        data.level === 'high' ? 'text-red-600' :
                                            'text-yellow-600'
                                    }`}>
                                    {data.level.charAt(0).toUpperCase() + data.level.slice(1)} Risk
                                </p>
                                {data.rawText && (
                                    <p className="text-xs text-gray-500 mt-1 italic">"{data.rawText}"</p>
                                )}
                            </div>
                        )}

                        {type === 'assets' && data.map((item, idx) => (
                            <div key={idx} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <p className="text-sm font-medium text-gray-800 mb-1">{item.text}</p>
                                {item.amounts && item.amounts.length > 0 && (
                                    <p className="text-lg font-bold text-purple-600">
                                        £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                                {item.rawText && (
                                    <p className="text-xs text-gray-500 mt-1 italic">"{item.rawText}"</p>
                                )}
                            </div>
                        ))}

                        {type === 'debts' && data.map((item, idx) => (
                            <div key={idx} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                                <p className="text-sm font-medium text-gray-800 mb-1">{item.text}</p>
                                {item.amounts && item.amounts.length > 0 && (
                                    <p className="text-lg font-bold text-orange-600">
                                        £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                                {item.rawText && (
                                    <p className="text-xs text-gray-500 mt-1 italic">"{item.rawText}"</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-2">{emptyMessage}</p>
                        <p className="text-xs text-gray-400">
                            Try saying something like: "I earn £55k at my job" or "I spend £2300 on rent"
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // Show a loading state if no messages yet
    if (!messages || messages.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Financial Data Summary</h3>
                <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No conversations yet</p>
                    <p className="text-sm text-gray-400">
                        Start chatting to see your financial data extracted automatically
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Financial Data Summary</h3>

                {/* Debug info - remove in production */}
                <div className="text-xs text-gray-400">
                    Messages: {messages.length} |
                    Income: {extractedData?.income?.length || 0} |
                    Expenses: {extractedData?.expenses?.length || 0} |
                    Goals: {extractedData?.goals?.length || 0}
                </div>
            </div>

            {/* Data Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getSummaryCard(
                    'income',
                    extractedData?.income || [],
                    <TrendingUp className="w-5 h-5 text-green-600" />,
                    'Income',
                    'Share your income details to get started'
                )}

                {getSummaryCard(
                    'expenses',
                    extractedData?.expenses || [],
                    <DollarSign className="w-5 h-5 text-red-600" />,
                    'Expenses',
                    'Tell me about your monthly expenses'
                )}

                {getSummaryCard(
                    'goals',
                    extractedData?.goals || [],
                    <Target className="w-5 h-5 text-blue-600" />,
                    'Financial Goals',
                    'What are your financial goals?'
                )}

                {getSummaryCard(
                    'risk',
                    extractedData?.riskTolerance,
                    <Shield className="w-5 h-5 text-purple-600" />,
                    'Risk Tolerance',
                    'Describe your investment risk preference'
                )}
            </div>

            {/* Test Button - remove in production */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Debug: Try saying "I earn 55k at my job, rent is 2,300 per month, 500 spent on beer and I want to retire at 65"
                    </p>
                    <button
                        onClick={forceDataExtraction}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                    >
                        Force Re-extract
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataSummary;
  

