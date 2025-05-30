import React from 'react';
import ChatInterface from '../components/Chat/ChatInterface';
import DataSummary from '../components/DataSummary/DataSummary';
import DynamicPlanning from '../components/Planning/DynamicPlanning';
import DebugPanel from '../components/DebugPanel';


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

        {/* Dynamic Planning - Now on the right side (replaces KeyInsights) */}
        <div className="lg:col-span-1">
          <div className="lg:max-h-[700px] lg:overflow-y-auto lg:pr-2">
            <DynamicPlanning />
          </div>
        </div>

        {/* Data Summary Cards - Full width below chat */}
        <div className="lg:col-span-3">
          <DataSummary />
        </div>
        <DebugPanel />

       
      </div>
    </div>
  );
};

export default Chat;




