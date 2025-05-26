import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Target, Shield, PiggyBank } from 'lucide-react';

const DataSummary = () => {
    const { extractedData, insights, getCompletionScore } = useApp();

    const completionScore = getCompletionScore();

    const summaryCards = [
        {
            title: 'Income Information',
            icon: TrendingUp,
            count: extractedData.income?.length || 0,
            iconColor: 'text-accent-green',
            bgColor: 'bg-accent-green/10'
        },
        {
            title: 'Financial Goals',
            icon: Target,
            count: extractedData.goals?.length || 0,
            iconColor: 'text-primary-blue',
            bgColor: 'bg-primary-blue/10'
        },
        {
            title: 'Risk Profile',
            icon: Shield,
            count: extractedData.riskTolerance ? 1 : 0,
            iconColor: 'text-info',
            bgColor: 'bg-info/10'
        },
        {
            title: 'Expenses Mentioned',
            icon: PiggyBank,
            count: extractedData.expenses?.length || 0,
            iconColor: 'text-warning',
            bgColor: 'bg-warning/10'
        }
    ];

    return (
        <div className="section-spacing max-w-6xl mx-auto px-6">
            {/* Completion Progress */}
            <div className="card">
                <h3 className="text-h4 font-semibold text-primary-dark mb-16">Financial Planning Progress</h3>
                <div className="flex items-center space-x-16">
                    <div className="flex-1">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${completionScore}%` }}
                            ></div>
                        </div>
                    </div>
                    <span className="text-h4 font-bold text-primary-dark">
                        {completionScore}%
                    </span>
                </div>
                <p className="text-body-small text-secondary-gray mt-8">
                    {completionScore < 30 && "Keep chatting to build your financial profile!"}
                    {completionScore >= 30 && completionScore < 70 && "Good progress! Share more details for a comprehensive plan."}
                    {completionScore >= 70 && "Excellent! You have enough information for a detailed financial plan."}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-8">
                {summaryCards.map((card, index) => (
                    <div key={index} className="card text-center flex flex-col items-center p-6 min-w-[12rem] min-h-[14rem]">
                        <div className={`${card.bgColor} rounded-button flex items-center justify-center p-6 mb-4 min-w-[6rem] min-h-[6rem]`}>
                            <card.icon className={`icon-standard ${card.iconColor}`} />
                        </div>
                        <div className="text-financial font-bold text-primary-dark">{card.count}</div>
                        <div className="text-body-small text-secondary-gray font-medium mt-2">{card.title}</div>
                    </div>
                ))}
            </div>

            {/* Insights */}
            {insights.length > 0 && (
                <div className="card">
                    <h3 className="text-h4 font-semibold text-primary-dark mb-16">Key Insights</h3>
                    <div className="item-spacing">
                        {insights.map((insight, index) => (
                            <div key={index} className="p-16 bg-secondary-blue-pale rounded-button">
                                <p className="text-body text-primary-blue">{insight.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataSummary;
