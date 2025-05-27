import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, TrendingUp, DollarSign, Shield, AlertCircle } from 'lucide-react';
import dataExtractionService from '../../services/dataExtraction';

const DataSummary = () => {
    const { messages, extractedData, updateExtractedData } = useApp();

    // Extract data whenever messages change
    const currentExtractedData = useMemo(() => {
        if (!messages || messages.length === 0) return null;

        const newData = dataExtractionService.extractFinancialData(messages);

        // Update context if we have new data
        if (updateExtractedData) {
            updateExtractedData(newData);
        }

        return newData;
    }, [messages, updateExtractedData]);

    // Use either the newly extracted data or existing context data
    const dataToUse = currentExtractedData || extractedData || {
        income: [],
        expenses: [],
        goals: [],
        riskTolerance: null
    };

    const getSummaryCard = (type, data, icon, title, emptyMessage) => {
        const hasData = Array.isArray(data) ? data.length > 0 : data !== null;

        return (
            <div key={type} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        {icon}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
                </div>

                {hasData ? (
                    <div className="space-y-2">
                        {type === 'income' && data.map((item, idx) => (
                            <div key={idx} className="p-3 bg-green-50 rounded-lg">
                                <p className="text-sm text-gray-700 mb-1">{item.text}</p>
                                {item.amounts.length > 0 && (
                                    <p className="text-lg font-bold text-green-600">
                                        £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}

                        {type === 'expenses' && data.map((item, idx) => (
                            <div key={idx} className="p-3 bg-red-50 rounded-lg">
                                <p className="text-sm text-gray-700 mb-1">{item.text}</p>
                                {item.amounts && item.amounts.length > 0 && (
                                    <p className="text-lg font-bold text-red-600">
                                        £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}

                        {type === 'goals' && data.map((item, idx) => (
                            <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-700 mb-1">{item.text}</p>
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
                                        £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}

                        {type === 'risk' && (
                            <div className={`p-3 rounded-lg ${data.level === 'low' ? 'bg-green-50' :
                                    data.level === 'high' ? 'bg-red-50' : 'bg-yellow-50'
                                }`}>
                                <p className="text-sm text-gray-700 mb-1">{data.text}</p>
                                <p className={`text-lg font-bold ${data.level === 'low' ? 'text-green-600' :
                                        data.level === 'high' ? 'text-red-600' : 'text-yellow-600'
                                    }`}>
                                    {data.level.charAt(0).toUpperCase() + data.level.slice(1)} Risk
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">{emptyMessage}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Financial Data Summary</h3>

            {/* Data Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getSummaryCard(
                    'income',
                    dataToUse.income,
                    <TrendingUp className="w-5 h-5 text-green-600" />,
                    'Income',
                    'Share your income details to get started'
                )}

                {getSummaryCard(
                    'expenses',
                    dataToUse.expenses,
                    <DollarSign className="w-5 h-5 text-red-600" />,
                    'Expenses',
                    'Tell me about your monthly expenses'
                )}

                {getSummaryCard(
                    'goals',
                    dataToUse.goals,
                    <Target className="w-5 h-5 text-blue-600" />,
                    'Financial Goals',
                    'What are your financial goals?'
                )}

                {getSummaryCard(
                    'risk',
                    dataToUse.riskTolerance,
                    <Shield className="w-5 h-5 text-purple-600" />,
                    'Risk Tolerance',
                    'Describe your investment risk preference'
                )}
            </div>
        </div>
    );
};

export default DataSummary;
  

