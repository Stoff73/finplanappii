import React from 'react';
import ChatInterface from '../components/Chat/ChatInterface';
import DataSummary from '../components/DataSummary/DataSummary';
import KeyInsights from '../components/DataSummary/KeyInsights';

const Chat = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-0">
      <div className="grid lg:grid-cols-3 gap-6 h-[600px] min-h-0">
        <div className="h-full flex flex-col min-h-0 lg:col-span-2">
          <ChatInterface />
        </div>

        <div className="h-full lg:col-span-1">
          <DataSummary />
        </div>

        {/* Key Insights below all three columns */}
        <div className="mt-6 lg:col-span-3">
          <div className="bg-blue-100 p-4 rounded-xl">
            <KeyInsights />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
