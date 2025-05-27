import React from 'react';
import ChatInterface from '../components/Chat/ChatInterface';
import DataSummary from '../components/DataSummary/DataSummary';
import KeyInsights from '../components/DataSummary/KeyInsights';

const Chat = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-0">
      <div className="grid lg:grid-cols-3 gap-6 min-h-0 h-[600px] sm:h-auto xs:h-auto flex flex-col sm:grid sm:grid-cols-1">
        <div className="h-full flex flex-col min-h-0 lg:col-span-2">
          <ChatInterface />
        </div>

        <div className="h-full lg:col-span-1">
          <DataSummary />
        </div>

        {/* Key Insights below all three columns */}
        <div className="mt-6 lg:col-span-3">
          <div className="bg-blue-100 p-4 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Key Insights</h2>
            <div className="flex flex-wrap gap-4">
              {/* Example insight cards */}
              <div className="bg-white p-4 rounded-lg shadow-md w-[300px] flex-shrink-0">
                Income sources include salary, freelance, and investments.
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md w-[300px] flex-shrink-0">
                Goals include saving for a house and early retirement.
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md w-[300px] flex-shrink-0">
                Current expenses include rent, groceries, and subscriptions.
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md w-[300px] flex-shrink-0">
                Risk tolerance is moderate with openness to some market volatility.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
