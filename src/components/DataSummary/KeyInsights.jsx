import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, AlertTriangle, CheckCircle, Info, Target, Shield } from 'lucide-react';
import dataExtractionService from '../../services/dataExtraction';

const KeyInsights = () => {
    const { messages, extractedData, insights } = useApp();

    // Generate insights based on current data, prefer context insights first
    const currentInsights = useMemo(() => {
        // If we have insights from context, use those
        if (insights && insights.length > 0) {
            return insights;
        }

        // Otherwise generate fresh insights
        if (!messages || messages.length === 0) return [];

        const currentData = extractedData || dataExtractionService.extractFinancialData(messages);
        return dataExtractionService.generateInsights(currentData);
    }, [messages, extractedData, insights]);

    const getInsightIcon = (type) => {
        switch (type) {
            case 'income':
                return <TrendingUp className="w-5 h-5 text-green-600" />;
            case 'expenses':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'goals':
                return <Target className="w-5 h-5 text-blue-600" />;
            case 'risk':
                return <Shield className="w-5 h-5 text-purple-600" />;
            default:
                return <Info className="w-5 h-5 text-gray-600" />;
        }
    };

    const getInsightColor = (type) => {
        switch (type) {
            case 'income':
                return 'bg-green-50 border-green-200';
            case 'expenses':
                return 'bg-red-50 border-red-200';
            case 'goals':
                return 'bg-blue-50 border-blue-200';
            case 'risk':
                return 'bg-purple-50 border-purple-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getInsightTitle = (type) => {
        switch (type) {
            case 'income':
                return 'Income Analysis';
            case 'expenses':
                return 'Spending Analysis';
            case 'goals':
                return 'Goals Overview';
            case 'risk':
                return 'Risk Assessment';
            default:
                return 'Financial Insight';
        }
    };

    if (currentInsights.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h3>
                <div className="text-center py-8">
                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No insights available yet</p>
                    <p className="text-sm text-gray-400">
                        Start chatting about your finances to see personalized insights here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Insights</h3>

            <div className="space-y-4">
                {currentInsights.map((insight, index) => (
                    <div
                        key={`insight-${insight.type}-${index}`}
                        className={`p-4 rounded-xl border ${getInsightColor(insight.type)}`}
                    >
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                                {getInsightIcon(insight.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                    {getInsightTitle(insight.type)}
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {insight.message}
                                </p>

                                {/* Display insight value if it exists and is meaningful */}
                                {insight.value && (
                                    <div className="mt-2">
                                        {typeof insight.value === 'number' && insight.type === 'income' && (
                                            <p className="text-lg font-bold text-green-600">
                                                £{insight.value.toLocaleString()}
                                            </p>
                                        )}
                                        {typeof insight.value === 'number' && insight.type === 'expenses' && (
                                            <p className="text-lg font-bold text-red-600">
                                                £{insight.value.toLocaleString()}
                                            </p>
                                        )}
                                        {Array.isArray(insight.value) && insight.type === 'goals' && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {insight.value.map((goal, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                                    >
                                                        {goal}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {typeof insight.value === 'string' && insight.type === 'risk' && (
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${insight.value === 'low' ? 'bg-green-100 text-green-800' :
                                                    insight.value === 'high' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {insight.value.charAt(0).toUpperCase() + insight.value.slice(1)} Risk
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary insights if we have multiple types */}
            {currentInsights.length > 2 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                Profile Summary
                            </h4>
                            <p className="text-sm text-blue-800">
                                Great progress! You've shared information about {currentInsights.length} key areas of your finances.
                                This helps me provide more personalized advice and recommendations.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Action Hint */}
            {currentInsights.length >= 1 && currentInsights.length < 3 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600">
                        💡 Share more details about your financial situation to unlock additional insights and recommendations.
                    </p>
                </div>
            )}
        </div>
    );
};

export default KeyInsights;