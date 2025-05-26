import React from 'react';
import { useApp } from '../context/AppContext';

const Home = () => {
    const { messages, getCompletionScore } = useApp();

    const hasData = messages.length > 0;
    const completionScore = getCompletionScore();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold text-gray-900">
                    Financial Planning Assistant
                </h1>
                <div className="card">
                    <p className="text-base text-gray-600 mb-4">
                        Welcome to your financial planning journey.
                    </p>
                    {hasData ? (
                        <p className="text-sm text-gray-500">
                            Your profile is {completionScore}% complete.
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Start by having a conversation with our AI assistant.
                        </p>
                    )}
                    
                    <div id="buttonMove" className="mt-6 pb-6">
                        <a href="/chat" className="btn-primary">
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

    
