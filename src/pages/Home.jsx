import React from 'react';
import { useApp } from '../context/AppContext';

const Home = () => {
    const { messages, getCompletionScore } = useApp();

    const hasData = messages.length > 0;
    const completionScore = getCompletionScore();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 col-span-2">
                <h1 className="text-4xl font-bold text-gray-900">
                    Financial Planning Assistant
                </h1>
                <div className="card col-span-2">
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
                    {(!hasData || completionScore === 0) && (
                        <div id="buttonMove" className="mt-6 pb-6">
                            <a href="/chat" className="btn-primary">
                                Get Started
                            </a>
                        </div>
                    )}
                </div>
                <div className="mb-6"></div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="card p-4">
                    <h2 className="text-xl font-semibold mb-2">Current version features MVP 1.0</h2>
                    <ul>
                        <li>Integrated AI planner, using text discussion</li>
                        <li>Persistent local data, for context discussion. Session based</li>
                        <li>Goal recognition, and population for planning, static to get the logic right</li>
                        <li>Export function working, export unformatted plan to pdf</li>
                        <li>Plan completions progress bar working</li>
                        <li>Data summary cards, with key insights based on user data input</li>
                        <li>Dashboard up and linked</li>
                    </ul>
                </div>
                <div className="card p-4">
                    <h2 className="text-xl font-semibold mb-2">Next version features MVP 1.1</h2>
                    <ul>
                        <li>Custom GPT/multi agent setup</li>
                        <li>AI chat window info parsing, so we can get rid of matching for plan update</li>
                        <li>Goal based planning, with cashflow and net worth, dynamic</li>
                        <li>Integrated intelligent factfind modal for ease of entering data</li>
                        <li>Full formatted financial plan export to pdf</li>
                        <li>Data summary cards, with key insights using financial insights</li>
                        <li>Persistent data storage in Database</li>
                        <li>User registration/login</li>
                        <li>Functional settings page for user</li>
                        <li>Risk profile specialty agent</li>
                        <li>Asset allocation engine for risk profile</li>
                        <li>AI optical tool for seeing documents</li>
                        <li>upload and scan enabled</li>
                        <li>TTS/voice integration with AI</li>
                        <li>External API hooks, ready for connection</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;

    
