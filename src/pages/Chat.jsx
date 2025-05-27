import React from 'react';
import ChatInterface from '../components/Chat/ChatInterface';
import DataSummary from '../components/DataSummary/DataSummary';
import KeyInsights from '../components/DataSummary/KeyInsights';
import ProfileCompletion from '../components/DataSummary/ProfileCompletion';

const Chat = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2 min-h-0">
          <div className="h-[600px] lg:h-[700px]">
            <ChatInterface />
          </div>
        </div>

        {/* Key Insights - Now on the right side (was DataSummary before) */}
        <div className="lg:col-span-1">
          <div className="lg:max-h-[700px] lg:overflow-y-auto lg:pr-2">
            <KeyInsights />
          </div>
        </div>

        {/* Data Summary Cards - Full width below chat (moved up) */}
        <div className="lg:col-span-3">
          <DataSummary />
        </div>

        {/* Progress Bar - Full width below data summary (moved down) */}
        <div className="lg:col-span-3">
          <ProfileCompletion />
        </div>
      </div>
    </div>
  );
};

export default Chat;




