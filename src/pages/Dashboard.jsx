import React from 'react';
import { useApp } from '../context/AppContext';
import DataSummary from '../components/DataSummary/DataSummary';
import GoalsTracker from '../components/Dashboard/GoalsTracker';
import SimpleChart from '../components/Dashboard/SimpleChart';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Target,
    PiggyBank,
    TrendingUpIcon,
    Shield,
    Building
} from 'lucide-react';

const Dashboard = () => {
    const { messages, getCompletionScore, extractedData } = useApp();

    const completionScore = getCompletionScore();
    const hasData = messages.length > 1;

    // Calculate financial metrics
    const totalIncome = extractedData?.income?.reduce((sum, item) => {
        return sum + (item.amounts?.[0] || 0);
    }, 0) || 0;

    const totalExpenses = extractedData?.expenses?.reduce((sum, item) => {
        return sum + (item.amounts?.[0] || 0);
    }, 0) || 0;

    const netPosition = totalIncome - totalExpenses;
    const goalCount = extractedData?.goals?.length || 0;

    if (!hasData) {
        return (
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial Dashboard</h1>
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Your Dashboard</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Start by having a conversation with our AI assistant to build your financial profile.
                            Once you share your financial information, you'll see personalized insights and charts here.
                        </p>
                        <a
                            href="/chat"
                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-800 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
                        >
                            Start Financial Chat
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
                    <p className="text-gray-600 mt-1">Overview of your financial position</p>
                </div>
                <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                            Profile: {completionScore}% complete
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Data Summary - Full Width */}
                <DataSummary />

                {/* Financial Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-2">Total Income</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    £{totalIncome.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Monthly</p>
                            </div>
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-2">Total Expenses</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    £{totalExpenses.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Monthly</p>
                            </div>
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-2">Net Position</p>
                                <p className={`text-2xl font-bold ${netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    £{netPosition.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Monthly surplus</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${netPosition >= 0 ? 'bg-green-50' : 'bg-red-50'
                                }`}>
                                <DollarSign className={`w-6 h-6 ${netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-2">Active Goals</p>
                                <p className="text-2xl font-bold text-gray-900">{goalCount}</p>
                                <p className="text-xs text-gray-500 mt-1">Financial objectives</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Target className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Products Cards */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Financial Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Pensions Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <Building className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Pensions</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Total Value</span>
                                    <span className="text-sm font-semibold text-gray-900">£45,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Monthly Contribution</span>
                                    <span className="text-sm font-semibold text-gray-900">£400</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Retirement Target</span>
                                    <span className="text-sm font-semibold text-gray-900">£500,000</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Progress</span>
                                    <span className="text-xs font-medium text-gray-700">9%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '9%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Investments Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <TrendingUpIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Investments</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Portfolio Value</span>
                                    <span className="text-sm font-semibold text-gray-900">£12,500</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Monthly Investment</span>
                                    <span className="text-sm font-semibold text-gray-900">£250</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">This Month</span>
                                    <span className="text-sm font-semibold text-green-600">+£180</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Risk Level</span>
                                    <span className="text-xs font-medium text-blue-600">Medium</span>
                                </div>
                                <div className="flex space-x-1 mt-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Savings Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                    <PiggyBank className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Savings</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Emergency Fund</span>
                                    <span className="text-sm font-semibold text-gray-900">£8,500</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">House Deposit</span>
                                    <span className="text-sm font-semibold text-gray-900">£15,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Interest Rate</span>
                                    <span className="text-sm font-semibold text-gray-900">4.2%</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Monthly Growth</span>
                                    <span className="text-xs font-medium text-green-600">+£82</span>
                                </div>
                            </div>
                        </div>

                        {/* Protection Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Protection</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Life Insurance</span>
                                    <span className="text-sm font-semibold text-gray-900">£200,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Income Protection</span>
                                    <span className="text-sm font-semibold text-gray-900">£3,000/mo</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Monthly Premium</span>
                                    <span className="text-sm font-semibold text-gray-900">£45</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Coverage</span>
                                    <span className="text-xs font-medium text-green-600">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Goals and Charts Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <GoalsTracker />
                    <SimpleChart />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

