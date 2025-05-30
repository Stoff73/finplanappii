import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, TrendingUp, DollarSign, Shield, AlertCircle, Home, PiggyBank, Clock, Users, Award } from 'lucide-react';
import dataExtractionService from '../../services/dataExtraction';

const DataSummary = () => {
    const { messages, extractedData, updateExtractedData, selectedGoal } = useApp();

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

    // Define goal-specific card configurations
    const getGoalSpecificCards = (goalType) => {
        switch (goalType) {
            case 'retirement':
                return [
                    { key: 'income', title: 'Current Income', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
                    { key: 'pension', title: 'Pension Plans', icon: Award, color: 'text-purple-600', bgColor: 'bg-purple-50' },
                    { key: 'riskTolerance', title: 'Risk Profile', icon: Shield, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                    { key: 'retirementAge', title: 'Retirement Age', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
                    { key: 'expenses', title: 'Current Expenses', icon: DollarSign, color: 'text-red-600', bgColor: 'bg-red-50' },
                    { key: 'assets', title: 'Existing Savings', icon: PiggyBank, color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
                ];
            case 'saving':
                return [
                    { key: 'goals', title: 'Savings Goals', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                    { key: 'income', title: 'Monthly Income', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
                    { key: 'expenses', title: 'Monthly Expenses', icon: DollarSign, color: 'text-red-600', bgColor: 'bg-red-50' },
                    { key: 'timeframe', title: 'Target Timeframe', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
                    { key: 'assets', title: 'Current Savings', icon: PiggyBank, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
                    { key: 'savingsCapacity', title: 'Savings Capacity', icon: TrendingUp, color: 'text-emerald-600', bgColor: 'bg-emerald-50' }
                ];
            case 'investment':
                return [
                    { key: 'riskTolerance', title: 'Risk Tolerance', icon: Shield, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                    { key: 'income', title: 'Investment Capacity', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
                    { key: 'goals', title: 'Investment Goals', icon: Target, color: 'text-purple-600', bgColor: 'bg-purple-50' },
                    { key: 'timeframe', title: 'Investment Timeframe', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
                    { key: 'assets', title: 'Existing Investments', icon: Award, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
                    { key: 'diversification', title: 'Portfolio Mix', icon: PiggyBank, color: 'text-teal-600', bgColor: 'bg-teal-50' }
                ];
            case 'protection':
                return [
                    { key: 'income', title: 'Income to Protect', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
                    { key: 'dependents', title: 'Dependents', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                    { key: 'expenses', title: 'Monthly Obligations', icon: DollarSign, color: 'text-red-600', bgColor: 'bg-red-50' },
                    { key: 'debts', title: 'Outstanding Debts', icon: Home, color: 'text-orange-600', bgColor: 'bg-orange-50' },
                    { key: 'existingCover', title: 'Existing Coverage', icon: Shield, color: 'text-purple-600', bgColor: 'bg-purple-50' },
                    { key: 'assets', title: 'Assets to Protect', icon: PiggyBank, color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
                ];
            case 'comprehensive':
                return [
                    { key: 'income', title: 'Income Sources', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
                    { key: 'expenses', title: 'Monthly Expenses', icon: DollarSign, color: 'text-red-600', bgColor: 'bg-red-50' },
                    { key: 'goals', title: 'Financial Goals', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                    { key: 'riskTolerance', title: 'Risk Profile', icon: Shield, color: 'text-purple-600', bgColor: 'bg-purple-50' },
                    { key: 'assets', title: 'Assets & Savings', icon: PiggyBank, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
                    { key: 'protection', title: 'Protection Needs', icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-50' }
                ];
            default:
                return [
                    { key: 'income', title: 'Income', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
                    { key: 'expenses', title: 'Expenses', icon: DollarSign, color: 'text-red-600', bgColor: 'bg-red-50' },
                    { key: 'goals', title: 'Goals', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                    { key: 'riskTolerance', title: 'Risk Profile', icon: Shield, color: 'text-purple-600', bgColor: 'bg-purple-50' }
                ];
        }
    };

    const getSummaryCard = (cardConfig, data, emptyMessage) => {
        const { key, title, icon: Icon, color, bgColor } = cardConfig;

        // Special handling for different data types
        let hasData = false;
        let cardData = null;

        switch (key) {
            case 'income':
                hasData = Array.isArray(data.income) && data.income.length > 0;
                cardData = data.income;
                break;
            case 'expenses':
                hasData = Array.isArray(data.expenses) && data.expenses.length > 0;
                cardData = data.expenses;
                break;
            case 'goals':
                hasData = Array.isArray(data.goals) && data.goals.length > 0;
                cardData = data.goals;
                break;
            case 'riskTolerance':
            case 'risk':
                hasData = data.riskTolerance !== null;
                cardData = data.riskTolerance;
                break;
            case 'assets':
                hasData = Array.isArray(data.assets) && data.assets.length > 0;
                cardData = data.assets;
                break;
            case 'debts':
                hasData = Array.isArray(data.debts) && data.debts.length > 0;
                cardData = data.debts;
                break;
            default:
                // For goal-specific fields that don't directly map to extractedData
                hasData = false;
                cardData = null;
        }

        return (
            <div key={key} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
                </div>

                {hasData ? (
                    <div className="space-y-2">
                        {/* Income Data */}
                        {key === 'income' && cardData.map((item, idx) => (
                            <div key={idx} className="p-3 bg-green-50 rounded-lg">
                                <p className="text-sm text-gray-700 mb-1">{item.text}</p>
                                {item.amounts && item.amounts.length > 0 && (
                                    <p className="text-lg font-bold text-green-600">
                                        £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Expenses Data */}
                        {key === 'expenses' && cardData.map((item, idx) => (
                            <div key={idx} className="p-3 bg-red-50 rounded-lg">
                                <p className="text-sm text-gray-700 mb-1">{item.text}</p>
                                {item.amounts && item.amounts.length > 0 && (
                                    <p className="text-lg font-bold text-red-600">
                                        £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Goals Data */}
                        {key === 'goals' && cardData.map((item, idx) => (
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

                        {/* Risk Tolerance Data */}
                        {(key === 'riskTolerance' || key === 'risk') && (
                            <div className={`p-3 rounded-lg ${cardData.level === 'low' ? 'bg-green-50' :
                                cardData.level === 'high' ? 'bg-red-50' : 'bg-yellow-50'
                                }`}>
                                <p className="text-sm text-gray-700 mb-1">{cardData.text}</p>
                                <p className={`text-lg font-bold ${cardData.level === 'low' ? 'text-green-600' :
                                    cardData.level === 'high' ? 'text-red-600' : 'text-yellow-600'
                                    }`}>
                                    {cardData.level.charAt(0).toUpperCase() + cardData.level.slice(1)} Risk
                                </p>
                            </div>
                        )}

                        {/* Assets Data */}
                        {key === 'assets' && cardData.map((item, idx) => (
                            <div key={idx} className="p-3 bg-indigo-50 rounded-lg">
                                <p className="text-sm text-gray-700 mb-1">{item.text}</p>
                                {item.amounts && item.amounts.length > 0 && (
                                    <p className="text-lg font-bold text-indigo-600">
                                        £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Debts Data */}
                        {key === 'debts' && cardData.map((item, idx) => (
                            <div key={idx} className="p-3 bg-orange-50 rounded-lg">
                                <p className="text-sm text-gray-700 mb-1">{item.text}</p>
                                {item.amounts && item.amounts.length > 0 && (
                                    <p className="text-lg font-bold text-orange-600">
                                        £{item.amounts[0].toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}
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

    // Don't show anything if no goal is selected
    if (!selectedGoal) {
        return null;
    }

    const goalCards = getGoalSpecificCards(selectedGoal.id);
    const emptyMessages = {
        income: 'Share your income details to get started',
        expenses: 'Tell me about your monthly expenses',
        goals: 'What are your financial goals?',
        riskTolerance: 'Describe your investment risk preference',
        risk: 'Describe your investment risk preference',
        assets: 'Share details about your savings and investments',
        debts: 'Tell me about any debts or loans you have',
        pension: 'Share your pension arrangements',
        retirementAge: 'What age would you like to retire?',
        timeframe: 'When do you want to achieve this goal?',
        dependents: 'Tell me about your dependents',
        existingCover: 'Share your existing insurance coverage',
        savingsCapacity: 'Based on income minus expenses',
        diversification: 'Share your investment preferences',
        protection: 'Tell me about your protection needs'
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {selectedGoal.label} - Data Summary
            </h3>

            {/* Goal-Specific Data Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goalCards.map((cardConfig) =>
                    getSummaryCard(
                        cardConfig,
                        dataToUse,
                        emptyMessages[cardConfig.key] || 'Share relevant information'
                    )
                )}
            </div>
        </div>
    );
};

export default DataSummary;
  

