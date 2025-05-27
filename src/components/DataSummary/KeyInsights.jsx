import React from 'react';
import { useApp } from '../../context/AppContext';

const KeyInsights = () => {
    const { insights } = useApp();

    if (insights.length === 0) {
        return null;
    }

    return (
        <div className="card mt-10 p-6">
            <h3 className="text-h4 font-semibold text-primary-dark mb-16">Key Insights</h3>
            <div className="flex flex-wrap gap-6">
                {insights.map((insight, index) => (
                    <div key={index} className="min-w-[200px] p-6 bg-secondary-blue-pale rounded-button">
                        <p className="text-body text-primary-blue break-words">{insight.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KeyInsights;