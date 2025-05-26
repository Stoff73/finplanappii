import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';

const SimpleChart = () => {
    const { extractedData } = useApp();

    // Prepare data for income vs expenses chart
    const totalIncome = extractedData.income?.reduce((sum, item) => {
        return sum + (item.amounts?.[0] || 0);
    }, 0) || 0;

    const totalExpenses = extractedData.expenses?.reduce((sum, item) => {
        return sum + (item.amounts?.[0] || 0);
    }, 0) || 0;

    const barData = [
        { name: 'Income', amount: totalIncome, color: '#22c55e' },
        { name: 'Expenses', amount: totalExpenses, color: '#ef4444' }
    ];

    // Prepare data for goals breakdown
    const goalTypes = {};
    extractedData.goals?.forEach(goal => {
        goal.type?.forEach(type => {
            goalTypes[type] = (goalTypes[type] || 0) + 1;
        });
    });

    const pieData = Object.keys(goalTypes).map((type, index) => ({
        name: type,
        value: goalTypes[type],
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
    }));

    if (totalIncome === 0 && totalExpenses === 0 && pieData.length === 0) {
        return (
            <div className="card text-center">
                <h3 className="text-lg font-semibold mb-2">Financial Overview</h3>
                <p className="text-gray-600">Share your financial information in the chat to see visualizations here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Income vs Expenses */}
            {(totalIncome > 0 || totalExpenses > 0) && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Bar dataKey="amount" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Goals Breakdown */}
            {pieData.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Goals Breakdown</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, value }) => `${name} (${value})`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleChart;
