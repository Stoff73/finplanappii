import React from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Calendar, DollarSign } from 'lucide-react';

const GoalsTracker = () => {
    const { extractedData } = useApp();

    const goals = extractedData.goals || [];

    if (goals.length === 0) {
        return (
            <div className="card text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Yet</h3>
                <p className="text-gray-600 mb-4">Start chatting about your financial goals to see them here.</p>
                <button className="btn-primary">
                    Start Chat
                </button>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">Your Financial Goals</h3>
            <div className="space-y-4">
                {goals.map((goal, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                    {goal.type?.length > 0 ? goal.type.join(', ') : 'Financial Goal'}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">{goal.text}</p>
                            </div>
                            <div className="flex items-center space-x-1 text-blue-600">
                                <Target className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {goal.amounts && goal.amounts.length > 0 && (
                                <div className="flex items-center space-x-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>£{goal.amounts[0].toLocaleString()}</span>
                                </div>
                            )}
                            {goal.timeframes && goal.timeframes.length > 0 && (
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{goal.timeframes[0].value} {goal.timeframes[0].unit}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalsTracker;
