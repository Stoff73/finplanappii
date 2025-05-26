import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

const FinancialOverview = () => {
    const { extractedData, insights } = useApp();

    // Calculate basic financial metrics
    const totalIncome = extractedData.income?.reduce((sum, item) => {
        return sum + (item.amounts?.[0] || 0);
    }, 0) || 0;

    const totalExpenses = extractedData.expenses?.reduce((sum, item) => {
        return sum + (item.amounts?.[0] || 0);
    }, 0) || 0;

    const netPosition = totalIncome - totalExpenses;
    const goalCount = extractedData.goals?.length || 0;

    const overviewCards = [
        {
            title: 'Monthly Income',
            value: `£${totalIncome.toLocaleString()}`,
            icon: TrendingUp,
            iconColor: 'text-accent-green',
            bgColor: 'bg-accent-green/10',
            change: null
        },
        {
            title: 'Monthly Expenses',
            value: `£${totalExpenses.toLocaleString()}`,
            icon: TrendingDown,
            iconColor: 'text-error',
            bgColor: 'bg-error/10',
            change: null
        },
        {
            title: 'Net Position',
            value: `£${netPosition.toLocaleString()}`,
            icon: DollarSign,
            iconColor: netPosition >= 0 ? 'text-accent-green' : 'text-error',
            bgColor: netPosition >= 0 ? 'bg-accent-green/10' : 'bg-error/10',
            change: null
        },
        {
            title: 'Active Goals',
            value: goalCount.toString(),
            icon: Target,
            iconColor: 'text-primary-blue',
            bgColor: 'bg-primary-blue/10',
            change: null
        }
    ];

    return (
        <div className="section-spacing">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
                {overviewCards.map((card, index) => (
                    <div key={index} className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-body-small font-medium text-secondary-gray mb-4">{card.title}</p>
                                <p className="text-financial-large">{card.value}</p>
                            </div>
                            <div className={`w-48 h-48 ${card.bgColor} rounded-button flex items-center justify-center`}>
                                <card.icon className={`icon-standard ${card.iconColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h3 className="text-h4 font-semibold text-primary-dark mb-20">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <button className="card-interactive text-left">
                        <h4 className="text-body font-semibold text-primary-dark">Add Manual Data</h4>
                        <p className="text-body-small text-secondary-gray mt-4">Enter financial information manually</p>
                    </button>
                    <button className="card-interactive text-left">
                        <h4 className="text-body font-semibold text-primary-dark">Set New Goal</h4>
                        <p className="text-body-small text-secondary-gray mt-4">Define a new financial objective</p>
                    </button>
                    <button className="card-interactive text-left">
                        <h4 className="text-body font-semibold text-primary-dark">Generate Plan</h4>
                        <p className="text-body-small text-secondary-gray mt-4">Create your financial plan</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinancialOverview;
