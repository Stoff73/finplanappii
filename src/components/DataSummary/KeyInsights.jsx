import React from 'react';
import { useApp } from '../../context/AppContext';

const KeyInsights = () => {
    const { insights } = useApp();

    if (insights.length === 0) {
        return null;
    }

    return (
        <div className="card mt-6">
            <h3 className="text-h4 font-semibold text-primary-dark mb-16">Key Insights</h3>
            <div className="item-spacing">
                {insights.map((insight, index) => (
                    <div key={index} className="p-16 bg-secondary-blue-pale rounded-button">
                        <p className="text-body text-primary-blue">{insight.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KeyInsights;