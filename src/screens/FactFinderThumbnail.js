import React, { useState } from 'react';
import { Cpu, MessageCircle, Mic, Loader2, CheckCircle } from 'lucide-react';

const FactFinderThumbnail = () => {
  const [state, setState] = useState(1);

  return (
    <div className="w-64 h-[28rem] bg-[#F9FAFB] rounded-lg shadow-lg p-4 flex flex-col relative text-xs font-sans overflow-hidden">
      {/* Screen number */}
      <div className="absolute top-2 left-2 text-xs font-semibold text-gray-500 select-none">Screen 2</div>

      {/* State selector */}
      <div className="flex justify-center space-x-2 mb-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`px-2 py-1 rounded-md text-xs font-semibold ${
              state === s ? 'bg-[#1E3A8A] text-white' : 'bg-white text-[#1E3A8A] border border-[#1E3A8A]'
            }`}
          >
            State {s}
          </button>
        ))}
      </div>

      {/* Content */}
      {state === 1 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">What matters most to you right now?</h1>
          <div className="bg-white rounded-md shadow p-2 text-[10px] text-gray-700">
            <p>Priority Selection with tappable cards (mocked)</p>
          </div>
        </div>
      )}

      {state === 2 && (
        <div>
          <div className="flex justify-center mb-2">
            <Cpu size={32} className="text-[#1E3A8A]" />
          </div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">AI Introduction</h1>
          <p className="text-[10px] text-gray-700">
            Warm, professional copy explaining AI assistance with FCA disclosure.
          </p>
          <p className="text-[10px] text-gray-500 mt-2">Example questions showing conversation style.</p>
          <label className="flex items-center mt-3 space-x-2 text-[10px]">
            <input type="checkbox" />
            <span>Consent to AI interaction</span>
          </label>
          <div className="flex space-x-2 mt-3 text-[10px] text-gray-500">
            <span>Security badges and regulatory compliance notes</span>
          </div>
        </div>
      )}

      {state === 3 && (
        <div className="flex flex-col space-y-2">
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Question Presentation</h1>
          <div className="bg-white rounded-md shadow p-2 text-[10px] text-gray-700">
            <p>Chat interface with AI messages and typing indicator (mocked)</p>
          </div>
          <div className="flex space-x-1 items-center text-gray-500 text-[10px]">
            <Loader2 className="animate-spin" size={16} />
            <span>AI is typing...</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-1 mt-2">
            <div className="bg-[#1E3A8A] h-1 rounded-full w-1/2 transition-all duration-300" />
          </div>
        </div>
      )}

      {state === 4 && (
        <div className="flex flex-col space-y-2">
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">User Response Input</h1>
          <div className="bg-white rounded-full border border-gray-300 flex items-center px-3 py-1 max-w-full">
            <input
              type="text"
              placeholder="Type your response..."
              className="flex-grow text-xs outline-none rounded-full px-2 py-1"
              style={{ maxHeight: '120px' }}
            />
            <button className="ml-2 bg-[#1E3A8A] rounded-full p-1">
              <MessageCircle size={16} color="white" />
            </button>
            <button className="ml-2">
              <Mic size={16} className="text-gray-500" />
            </button>
          </div>
          <div className="flex space-x-2 mt-2 text-[10px] text-gray-600">
            <button className="bg-[#EFF6FF] text-[#3B82F6] rounded-full px-2 py-1">Yes</button>
            <button className="bg-[#EFF6FF] text-[#3B82F6] rounded-full px-2 py-1">No</button>
            <button className="bg-[#EFF6FF] text-[#3B82F6] rounded-full px-2 py-1">Maybe</button>
          </div>
        </div>
      )}

      {state === 5 && (
        <div className="flex flex-col space-y-2 items-center justify-center flex-grow">
          <Loader2 className="animate-spin text-[#1E3A8A]" size={32} />
          <p className="text-[10px] text-gray-700">Understanding your response...</p>
          <div className="bg-white rounded-md shadow p-2 w-full text-[10px] text-gray-700">
            <p>Fact extraction visual with confidence indicators (mocked)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactFinderThumbnail;