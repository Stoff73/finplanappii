import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import dataExtractionService from '../../services/dataExtraction';

const KeyInsights = () => {
    const { messages, extractedData } = useApp();

    // Generate insights based on current data
    const insights = useMemo(() => {
        if (!messages || messages.length === 0) return [];

        const currentData = extractedData || dataExtractionService.extractFinancialData(messages);
        return dataExtractionService.generateInsights(currentData);
    }, [messages, extractedData]);

    const getInsightIcon = (type) => {
        switch (type) {
            case 'income':
                return <TrendingUp className="w-5 h-5 text-green-600" />;
            case 'expenses':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'goals':
                return <CheckCircle className="w-5 h-5 text-blue-600" />;
            case 'risk':
                return <Info className="w-5 h-5 text-purple-600" />;
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

    if (insights.length === 0) {
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
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-xl border ${getInsightColor(insight.type)}`}
                    >
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                                {getInsightIcon(insight.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2 capitalize">
                                    {insight.type} Insight
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {insight.message}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary insights if we have multiple types */}
            {insights.length > 2 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                Profile Summary
                            </h4>
                            <p className="text-sm text-blue-800">
                                Great progress! You've shared information about {insights.length} key areas of your finances.
                                This helps me provide more personalized advice and recommendations.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeyInsights;