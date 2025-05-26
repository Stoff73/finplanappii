import React, { useState } from 'react';
import { Bell, UserCheck, Settings, PlusCircle, CheckCircle, RefreshCw, Database, AlertTriangle } from 'lucide-react';

const InteractiveDashboardThumbnail = () => {
  const [state, setState] = useState(1);

  return (
    <div className="w-64 h-[32rem] bg-[#F9FAFB] rounded-lg shadow-lg p-4 flex flex-col relative text-xs font-sans overflow-auto">
      {/* Screen number */}
      <div className="absolute top-2 left-2 text-xs font-semibold text-gray-500 select-none">Screen 4</div>

      {/* State selector */}
      <div className="flex flex-wrap justify-center gap-1 mb-3">
        {[1,2,3,4,5,6,7,8].map((s) => (
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
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Dashboard Overview - Default Layout</h1>
          <p className="text-[10px] text-gray-700 mb-2">Personalized greeting, financial snapshot, notifications</p>
          <div className="flex items-center space-x-2 mb-2">
            <UserCheck size={20} className="text-[#1E3A8A]" />
            <span className="text-[10px]">Hello, Jane! Today is May 22, 2025</span>
          </div>
          <div className="bg-white rounded-md shadow p-2 mb-2 text-[10px]">
            <p><strong>Net Worth:</strong> $250,000</p>
            <p><strong>Monthly Change:</strong> +$1,200</p>
          </div>
          <div className="flex items-center space-x-1 text-[#1E3A8A]">
            <Bell size={16} />
            <span className="text-[10px]">3 new insights</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="col-span-2 bg-white rounded-md shadow p-2 text-[10px]">Net Worth Summary</div>
            <div className="bg-white rounded-md shadow p-2 text-[10px]">Goal Progress</div>
            <div className="bg-white rounded-md shadow p-2 text-[10px]">Recent Activity</div>
            <div className="bg-white rounded-md shadow p-2 text-[10px]">Action Items</div>
            <div className="bg-white rounded-md shadow p-2 text-[10px]">Account Connections</div>
          </div>
        </div>
      )}

      {state === 2 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Dashboard Overview - Customization Mode</h1>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold mb-2">Done</button>
          <p className="text-[10px] mb-2">Drag-and-drop widgets, add/remove, resize</p>
          <div className="bg-white rounded-md shadow p-2 text-[10px] mb-2">Selected widget with blue outline</div>
          <button className="text-[#1E3A8A] underline text-xs mb-2">Restore defaults</button>
        </div>
      )}

      {state === 3 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Goal Tracking - Goal Overview</h1>
          <div className="overflow-x-auto whitespace-nowrap mb-2">
            <div className="inline-block bg-white rounded-md shadow p-2 mr-2 text-[10px]">Goal 1 Progress</div>
            <div className="inline-block bg-white rounded-md shadow p-2 mr-2 text-[10px]">Goal 2 Progress</div>
            <div className="inline-block bg-white rounded-md shadow p-2 text-[10px]">Goal 3 Progress</div>
          </div>
          <p className="text-[10px]">Circular progress, timeline bars, milestone markers</p>
          <button className="flex items-center space-x-1 bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">
            <PlusCircle size={16} />
            <span>New Goal</span>
          </button>
        </div>
      )}

      {state === 4 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Goal Tracking - Goal Creation/Editing</h1>
          <p className="text-[10px] mb-2">Goal type selection, target amount, date picker, notes</p>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Save Goal</button>
        </div>
      )}

      {state === 5 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Goal Tracking - Achievement Celebration</h1>
          <CheckCircle size={32} className="text-[#10B981] mb-2" />
          <p className="text-[10px] mb-2">Milestone reached animation and social sharing</p>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Continue</button>
        </div>
      )}

      {state === 6 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Account Integration - Connection Overview</h1>
          <p className="text-[10px] mb-2">Connected accounts with status indicators</p>
          <div className="bg-white rounded-md shadow p-2 text-[10px] mb-2">Account 1: Good</div>
          <div className="bg-white rounded-md shadow p-2 text-[10px] mb-2">Account 2: Needs Attention</div>
          <div className="bg-white rounded-md shadow p-2 text-[10px] mb-2">Account 3: Disconnected</div>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Add Account</button>
        </div>
      )}

      {state === 7 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Account Integration - Integration Management</h1>
          <p className="text-[10px] mb-2">Platform selection and security badges</p>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="bg-white rounded-md shadow p-2 text-[10px]">Bank A</div>
            <div className="bg-white rounded-md shadow p-2 text-[10px]">Bank B</div>
            <div className="bg-white rounded-md shadow p-2 text-[10px]">Bank C</div>
          </div>
          <p className="text-[10px]">Consent flow with clear explanations</p>
        </div>
      )}

      {state === 8 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Account Integration - Data Synchronization</h1>
          <p className="text-[10px] mb-2">Sync progress and history</p>
          <div className="bg-white rounded-md shadow p-2 text-[10px] mb-2">Last sync: 22 May 2025 14:30</div>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Manual Sync</button>
          <p className="text-[10px] text-red-600 mt-2">Error: Connection failed</p>
          <button className="text-[#1E3A8A] underline text-xs">Help & Support</button>
        </div>
      )}
    </div>
  );
};

export default InteractiveDashboardThumbnail;