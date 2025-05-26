import React from 'react';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
    const { messages, getCompletionScore } = useApp();

    const completionScore = getCompletionScore();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard
                </h1>
                <div className="card">
                    <p className="text-base text-gray-600">
                        Dashboard will be built in Day 5.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Profile completion: {completionScore}%
                    </p>
                    <p className="text-sm text-gray-500">
                        Messages: {messages.length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


