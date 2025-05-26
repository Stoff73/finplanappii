import React from 'react';
import { useApp } from '../context/AppContext';
import FinancialOverview from '../components/Dashboard/FinancialOverview';
import GoalsTracker from '../components/Dashboard/GoalsTracker';
import SimpleChart from '../components/Dashboard/SimpleChart';
import DataSummary from '../components/DataSummary/DataSummary';

const Dashboard = () => {
    const { messages, getCompletionScore } = useApp();

    const completionScore = getCompletionScore();
    const hasData = messages.length > 1; // More than just the initial AI message

    if (!hasData) {
        return (
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-2xl font-bold mb-6">Financial Dashboard</h1>
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Welcome to Your Dashboard</h3>
                    <p className="text-gray-600 mb-6">
                        Start by having a conversation with our AI assistant to build your financial profile.
                        Once you share your financial information, you'll see personalized insights and charts here.
                    </p>
                    <a href="/chat" className="btn-primary">
                        Start Financial Chat
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Financial Dashboard</h1>
                <div className="text-sm text-gray-600">
                    Profile: {completionScore}% complete
                </div>
            </div>

            <div className="space-y-8">
                {/* Financial Overview */}
                <FinancialOverview />

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Goals and Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        <GoalsTracker />
                        <SimpleChart />
                    </div>

                    {/* Data Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <DataSummary />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


