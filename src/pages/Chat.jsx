import React from 'react';
import ChatInterface from '../components/Chat/ChatInterface';
import DataSummary from '../components/DataSummary/DataSummary';

const Chat = () => {
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Financial Planning Chat</h1>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Chat Interface */}
                <div className="lg:col-span-2">
                    <ChatInterface />
                </div>

                {/* Data Summary Sidebar */}
                <div className="lg:col-span-1">
                    <DataSummary />
                </div>
            </div>
        </div>
    );
};

export default Chat;





