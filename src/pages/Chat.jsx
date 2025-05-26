import React from 'react';
import ChatInterface from '../components/Chat/ChatInterface';
import DataSummary from '../components/DataSummary/DataSummary';
import KeyInsights from '../components/DataSummary/KeyInsights';

const Chat = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Financial Planning Chat</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left side: Chat and Key Insights */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <ChatInterface />
          <KeyInsights />
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
