import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, TrendingUp } from 'lucide-react';
import dataExtractionService from '../../services/dataExtraction';

const ProfileCompletion = () => {
    const { messages, extractedData } = useApp();

    // Calculate completion data
    const completionData = useMemo(() => {
        if (!messages || messages.length === 0) return { score: 0, sections: [] };

        const currentData = extractedData || dataExtractionService.extractFinancialData(messages);
        const score = dataExtractionService.calculateCompletionScore(currentData);

        // Calculate individual section completions
        const sections = [
            {
                key: 'income',
                label: 'Income',
                weight: 25,
                completed: currentData.income && currentData.income.length > 0
            },
            {
                key: 'expenses',
                label: 'Expenses',
                weight: 20,
                completed: currentData.expenses && currentData.expenses.length > 0
            },
            {
                key: 'goals',
                label: 'Goals',
                weight: 30,
                completed: currentData.goals && currentData.goals.length > 0
            },
            {
                key: 'riskTolerance',
                label: 'Risk Profile',
                weight: 15,
                completed: currentData.riskTolerance !== null
            },
            {
                key: 'assets',
                label: 'Assets',
                weight: 10,
                completed: currentData.assets && currentData.assets.length > 0
            }
        ];

        return { score, sections };
    }, [messages, extractedData]);

    const getProgressColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-blue-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    const getProgressMessage = (score) => {
        if (score >= 80) return 'Excellent! Your profile is nearly complete.';
        if (score >= 60) return 'Good progress! Share more details for better insights.';
        if (score >= 40) return 'Getting there! Tell me more about your finances.';
        if (score >= 20) return 'Nice start! Keep sharing your financial information.';
        return 'Welcome! Share your financial details to get personalized advice.';
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Profile Completion</h3>
                <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">{completionData.score}%</span>
                </div>
            </div>

            {/* Main Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-semibold text-gray-900">{completionData.score}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor(completionData.score)}`}
                        style={{ width: `${completionData.score}%` }}
                    >
                        <div className="h-full bg-white bg-opacity-20 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    {getProgressMessage(completionData.score)}
                </p>
            </div>

            {/* Section Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {completionData.sections.map((section) => (
                    <div key={section.key} className="text-center">
                        <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${section.completed
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                            {section.completed ? (
                                <CheckCircle className="w-4 h-4" />
                            ) : (
                                <div className="w-3 h-3 rounded-full border-2 border-current"></div>
                            )}
                        </div>
                        <p className={`text-xs font-medium ${section.completed ? 'text-green-700' : 'text-gray-500'
                            }`}>
                            {section.label}
                        </p>
                        <p className="text-xs text-gray-400">{section.weight}%</p>
                    </div>
                ))}
            </div>

            {/* Quick Tips */}
            {completionData.score < 100 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Quick Tips to Complete Your Profile</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                        {!completionData.sections.find(s => s.key === 'income')?.completed && (
                            <p>• Share your income: "I earn £50k per year"</p>
                        )}
                        {!completionData.sections.find(s => s.key === 'expenses')?.completed && (
                            <p>• Mention your expenses: "I spend £2k per month"</p>
                        )}
                        {!completionData.sections.find(s => s.key === 'goals')?.completed && (
                            <p>• Tell me your goals: "I want to retire at 60"</p>
                        )}
                        {!completionData.sections.find(s => s.key === 'riskTolerance')?.completed && (
                            <p>• Describe your risk preference: "I'm a conservative investor"</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCompletion;