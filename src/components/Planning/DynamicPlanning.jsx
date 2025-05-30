import React from 'react';
import { useApp } from '../../context/AppContext';
import { Target, TrendingUp, CheckCircle, ArrowRight, Star } from 'lucide-react';

const DynamicPlanning = () => {
    const {
        selectedGoal,
        goalProgress,
        goalDefinitions,
        extractedData,
        isGoalComplete,
        getMissingRequirements,
        getNextQuestions
    } = useApp();

    // Safely get goal label with fallback
    const getGoalLabel = (goalId) => {
        if (!goalId || !goalDefinitions[goalId]) {
            return 'Financial Planning';
        }
        return goalDefinitions[goalId].label || 'Financial Planning';
    };

    // Safely get goal progress with fallback
    const getGoalProgressSafe = (goalId) => {
        if (!goalId || !goalProgress) {
            return 0;
        }
        return goalProgress[goalId] || 0;
    };

    // If no goal is selected, show goal selection prompt
    if (!selectedGoal) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-center">
                    <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Focus</h3>
                    <p className="text-gray-600 mb-4">
                        Select a financial goal in the chat to see your personalized planning progress here.
                    </p>
                    <div className="text-sm text-blue-600">
                        💬 Choose a goal in the chat to get started
                    </div>
                </div>
            </div>
        );
    }

    const currentProgress = getGoalProgressSafe(selectedGoal);
    const isComplete = currentProgress >= 80;
    const missingReqs = getMissingRequirements ? getMissingRequirements(selectedGoal) : [];
    const nextQuestions = getNextQuestions ? getNextQuestions(selectedGoal) : [];

    // Get goal-specific icons and colors
    const getGoalIcon = (goalType) => {
        const icons = {
            retirement: '🏖️',
            house: '🏠',
            emergency: '🛡️',
            investment: '📈',
            debt: '💳',
            education: '🎓'
        };
        return icons[goalType] || '🎯';
    };

    const getGoalColor = (goalType) => {
        const colors = {
            retirement: 'blue',
            house: 'green',
            emergency: 'orange',
            investment: 'purple',
            debt: 'red',
            education: 'indigo'
        };
        return colors[goalType] || 'blue';
    };

    const goalColor = getGoalColor(selectedGoal);
    const goalIcon = getGoalIcon(selectedGoal);

    return (
        <div className="space-y-6">
            {/* Current Goal Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 bg-${goalColor}-50 rounded-xl flex items-center justify-center`}>
                        <span className="text-2xl">{goalIcon}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {getGoalLabel(selectedGoal)}
                        </h3>
                        <p className="text-sm text-gray-600">Your current focus</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-900">{currentProgress}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 bg-${goalColor}-600`}
                            style={{ width: `${currentProgress}%` }}
                        >
                            <div className="h-full bg-white bg-opacity-20 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Status and Action */}
                {isComplete ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-900">Goal Planning Complete!</p>
                                <p className="text-sm text-green-700">Ready to generate your financial plan</p>
                            </div>
                        </div>
                        <button className="btn-success text-sm px-4 py-2">
                            View Plan
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Next Steps */}
                        {nextQuestions.length > 0 && (
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <h4 className="font-semibold text-blue-900 mb-2">Next Step</h4>
                                <p className="text-sm text-blue-800">{nextQuestions[0]}</p>
                            </div>
                        )}

                        {/* Missing Requirements */}
                        {missingReqs.length > 0 && (
                            <div className="text-sm text-gray-600">
                                <p className="font-medium mb-2">Still needed:</p>
                                <div className="space-y-1">
                                    {missingReqs.slice(0, 3).map((req, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                            <span className="capitalize">{req.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Other Planning Areas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Other Planning Areas</h4>

                <div className="grid grid-cols-1 gap-3">
                    {Object.entries(goalDefinitions).map(([goalId, definition]) => {
                        if (goalId === selectedGoal) return null;

                        const progress = getGoalProgressSafe(goalId);
                        const hasData = progress > 0;
                        const goalIconEmoji = getGoalIcon(goalId);

                        return (
                            <div
                                key={goalId}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">{goalIconEmoji}</span>
                                    <div>
                                        <p className="font-medium text-gray-900 group-hover:text-blue-800">
                                            {definition.label || goalId}
                                        </p>
                                        {hasData && (
                                            <p className="text-sm text-gray-600">{progress}% complete</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {hasData && (
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    )}
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                        💡 Tip: Address multiple goals for comprehensive financial planning
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>

                <div className="grid grid-cols-1 gap-3">
                    <button className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group text-left">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 group-hover:text-blue-800">
                                    Review Progress
                                </p>
                                <p className="text-sm text-gray-600">See detailed breakdown</p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </button>

                    <button className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group text-left">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100">
                                <Star className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 group-hover:text-green-800">
                                    Get Recommendations
                                </p>
                                <p className="text-sm text-gray-600">Personalized advice</p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                    </button>

                    <button className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group text-left">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100">
                                <Target className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 group-hover:text-purple-800">
                                    Add New Goal
                                </p>
                                <p className="text-sm text-gray-600">Expand your planning</p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                    </button>
                </div>
            </div>

            {/* Data Summary for Selected Goal */}
            {extractedData && Object.keys(extractedData).some(key =>
                Array.isArray(extractedData[key]) ? extractedData[key].length > 0 : extractedData[key]
            ) && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Data</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-xl font-bold text-green-600">
                                    {extractedData.income?.length || 0}
                                </div>
                                <div className="text-sm text-green-700">Income Sources</div>
                            </div>

                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <div className="text-xl font-bold text-red-600">
                                    {extractedData.expenses?.length || 0}
                                </div>
                                <div className="text-sm text-red-700">Expense Categories</div>
                            </div>

                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-xl font-bold text-blue-600">
                                    {extractedData.goals?.length || 0}
                                </div>
                                <div className="text-sm text-blue-700">Financial Goals</div>
                            </div>

                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="text-xl font-bold text-purple-600">
                                    {extractedData.assets?.length || 0}
                                </div>
                                <div className="text-sm text-purple-700">Assets</div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default DynamicPlanning;