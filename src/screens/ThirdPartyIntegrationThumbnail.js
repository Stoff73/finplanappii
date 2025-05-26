import React, { useState } from 'react';
import { Database, Shield, CheckCircle, RefreshCw, AlertTriangle, Search, UserPlus, Lock } from 'lucide-react';

const ThirdPartyIntegrationThumbnail = () => {
  const [state, setState] = useState(1);

  return (
    <div className="w-64 h-[32rem] bg-[#F9FAFB] rounded-lg shadow-lg p-4 flex flex-col relative text-xs font-sans overflow-auto">
      {/* Screen number */}
      <div className="absolute top-2 left-2 text-xs font-semibold text-gray-500 select-none">Screen 6</div>

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
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Integration Overview - Available Integrations</h1>
          <p className="text-[10px] mb-2">Grid of supported platforms with logos and connection status</p>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="bg-white rounded-md shadow p-2 text-[10px] flex flex-col items-center">
              <Database size={24} className="text-[#1E3A8A]" />
              <span>Bank A</span>
              <span className="text-green-600 text-[9px]">Connected</span>
            </div>
            <div className="bg-white rounded-md shadow p-2 text-[10px] flex flex-col items-center">
              <Database size={24} className="text-[#1E3A8A]" />
              <span>Bank B</span>
              <span className="text-gray-500 text-[9px]">Available</span>
            </div>
            <div className="bg-white rounded-md shadow p-2 text-[10px] flex flex-col items-center">
              <Database size={24} className="text-[#1E3A8A]" />
              <span>Bank C</span>
              <span className="text-gray-500 text-[9px]">Available</span>
            </div>
          </div>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Connect Account</button>
          <p className="text-[10px] mt-2">Benefits of connecting accounts</p>
        </div>
      )}

      {state === 2 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Integration Overview - Integration Benefits</h1>
          <p className="text-[10px] mb-2">How connected accounts improve recommendations</p>
          <div className="flex items-center space-x-2 mb-2">
            <Shield size={20} className="text-[#1E3A8A]" />
            <span className="text-[10px]">Security badges and compliance certifications</span>
          </div>
          <p className="text-[10px] mb-2">Data usage and user control explanation</p>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Get Started</button>
        </div>
      )}

      {state === 3 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Account Connection Flow - Institution Selection</h1>
          <p className="text-[10px] mb-2">Details about selected institution and connection method</p>
          <label className="flex items-center space-x-2 text-[10px] mb-2">
            <input type="checkbox" />
            <span>Consent form with clear language</span>
          </label>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Connect Securely</button>
        </div>
      )}

      {state === 4 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Account Connection Flow - Authentication Process</h1>
          <p className="text-[10px] mb-2">Progress and authentication steps</p>
          <div className="flex items-center space-x-2 mb-2">
            <RefreshCw size={16} className="text-[#1E3A8A]" />
            <span className="text-[10px]">Step 2 of 3</span>
          </div>
          <p className="text-[10px] mb-2">Two-factor authentication and security reminders</p>
          <button className="text-[#1E3A8A] underline text-xs">Help & Support</button>
        </div>
      )}

      {state === 5 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Account Connection Flow - Connection Validation</h1>
          <p className="text-[10px] mb-2">Testing connection and data preview</p>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Next</button>
        </div>
      )}

      {state === 6 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Data Management - Account Overview</h1>
          <p className="text-[10px] mb-2">Connected accounts list and health dashboard</p>
          <div className="bg-white rounded-md shadow p-2 text-[10px] mb-2">Account 1: Good</div>
          <div className="bg-white rounded-md shadow p-2 text-[10px] mb-2">Account 2: Needs Attention</div>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Refresh</button>
        </div>
      )}

      {state === 7 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Data Management - Sync Management</h1>
          <p className="text-[10px] mb-2">Sync history and error resolution</p>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold mb-2">Manual Sync</button>
          <p className="text-red-600 text-[10px] mb-2">Error: Connection failed</p>
          <button className="text-[#1E3A8A] underline text-xs">Help & Support</button>
        </div>
      )}

      {state === 8 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Data Management - Privacy Controls</h1>
          <p className="text-[10px] mb-2">Data permissions and sharing settings</p>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Manage Permissions</button>
          <button className="text-[#1E3A8A] underline text-xs mt-2">Disconnect Account</button>
        </div>
      )}
    </div>
  );
};

export default ThirdPartyIntegrationThumbnail;