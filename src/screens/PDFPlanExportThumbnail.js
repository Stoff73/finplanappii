import React, { useState } from 'react';
import { FileText, Download, Mail, Link, Lock, CheckCircle, RefreshCw, Trash2, Search } from 'lucide-react';

const PDFPlanExportThumbnail = () => {
  const [state, setState] = useState(1);

  return (
    <div className="w-64 h-[32rem] bg-[#F9FAFB] rounded-lg shadow-lg p-4 flex flex-col relative text-xs font-sans overflow-auto">
      {/* Screen number */}
      <div className="absolute top-2 left-2 text-xs font-semibold text-gray-500 select-none">Screen 5</div>

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
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Export Configuration - Template Selection</h1>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-white rounded-md shadow p-2 text-[10px] flex flex-col items-center">
              <FileText size={32} className="text-[#1E3A8A]" />
              <span className="mt-1 font-semibold">Executive Summary</span>
              <span className="text-gray-600 text-[9px]">2-3 pages</span>
            </div>
            <div className="bg-white rounded-md shadow p-2 text-[10px] flex flex-col items-center">
              <FileText size={32} className="text-[#1E3A8A]" />
              <span className="mt-1 font-semibold">Comprehensive Plan</span>
              <span className="text-gray-600 text-[9px]">10-15 pages</span>
            </div>
            <div className="bg-white rounded-md shadow p-2 text-[10px] flex flex-col items-center">
              <FileText size={32} className="text-[#1E3A8A]" />
              <span className="mt-1 font-semibold">Action Plan Only</span>
              <span className="text-gray-600 text-[9px]">5-7 pages</span>
            </div>
            <div className="bg-white rounded-md shadow p-2 text-[10px] flex flex-col items-center">
              <FileText size={32} className="text-[#1E3A8A]" />
              <span className="mt-1 font-semibold">Custom Sections</span>
              <span className="text-gray-600 text-[9px]">User-selected content</span>
            </div>
          </div>
          <p className="text-[10px] mb-2">Customization options: color scheme, logo inclusion, section selection</p>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Preview Document</button>
        </div>
      )}

      {state === 2 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Export Configuration - Delivery Options</h1>
          <div className="space-y-1 text-[10px] mb-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="delivery" defaultChecked />
              <span>Immediate download</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="delivery" />
              <span>Email delivery</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="delivery" />
              <span>Secure sharing link</span>
            </label>
          </div>
          <p className="text-[10px] mb-2">File format: PDF (primary)</p>
          <label className="flex items-center space-x-2 text-[10px] mb-2">
            <input type="checkbox" />
            <span>Password protection</span>
            <Lock size={14} className="text-gray-500 ml-1" />
          </label>
          <p className="text-[10px] mb-2">Save delivery preferences for future exports</p>
        </div>
      )}

      {state === 3 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Export Configuration - Generation Settings</h1>
          <div className="space-y-1 text-[10px] mb-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="quality" defaultChecked />
              <span>Standard quality</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="quality" />
              <span>High resolution</span>
            </label>
          </div>
          <div className="space-y-1 text-[10px] mb-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>Include charts</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>Include disclaimers</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>Include implementation sections</span>
            </label>
          </div>
          <p className="text-[10px] mb-2">Personalization: cover page customization and branding options</p>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Create PDF Document</button>
          <p className="text-[10px] text-gray-500 mt-1">Estimated file size and download time</p>
        </div>
      )}

      {state === 4 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Document Generation - Generation Progress</h1>
          <p className="text-[10px] mb-2">Content compilation, chart generation, document assembly, quality validation</p>
          <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
            <div className="bg-[#1E3A8A] h-2 rounded-full w-3/4 transition-all duration-300" />
          </div>
          <p className="text-[10px] text-gray-500 mb-2">Almost ready...</p>
          <button className="text-[#1E3A8A] underline text-xs">Cancel</button>
        </div>
      )}

      {state === 5 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Document Generation - Generation Complete</h1>
          <CheckCircle size={32} className="text-[#10B981] mb-2" />
          <p className="text-[10px] mb-2">Document ready notification with file size and page count</p>
          <div className="flex space-x-2 mb-2">
            <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Download Now</button>
            <button className="bg-white border border-[#1E3A8A] text-[#1E3A8A] rounded-md px-3 py-1 text-xs font-semibold">Preview</button>
            <button className="text-[#1E3A8A] underline text-xs font-semibold">Share</button>
          </div>
          <p className="text-[10px] mb-2">Generation timestamp, version info, expiry date</p>
          <button className="text-[#1E3A8A] underline text-xs font-semibold">Create new version</button>
        </div>
      )}

      {state === 6 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Document Management - Document Library</h1>
          <div className="space-y-2 mb-2">
            <div className="bg-white rounded-md shadow p-2 text-[10px] flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FileText size={20} className="text-[#1E3A8A]" />
                <span>Plan Summary - 22 May 2025</span>
              </div>
              <div className="flex space-x-2">
                <button className="text-[#1E3A8A] underline text-xs">Download</button>
                <button className="text-[#1E3A8A] underline text-xs">Share</button>
                <button className="text-[#1E3A8A] underline text-xs">Regenerate</button>
                <button className="text-red-600 underline text-xs">Delete</button>
              </div>
            </div>
            <div className="bg-white rounded-md shadow p-2 text-[10px] flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FileText size={20} className="text-[#1E3A8A]" />
                <span>Comprehensive Plan - 15 May 2025</span>
              </div>
              <div className="flex space-x-2">
                <button className="text-[#1E3A8A] underline text-xs">Download</button>
                <button className="text-[#1E3A8A] underline text-xs">Share</button>
                <button className="text-[#1E3A8A] underline text-xs">Regenerate</button>
                <button className="text-red-600 underline text-xs">Delete</button>
              </div>
            </div>
          </div>
          <p className="text-[10px]">Search and filter documents by date or type</p>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold mt-2">Manage Storage</button>
        </div>
      )}

      {state === 7 && (
        <div>
          <h1 className="text-sm font-bold text-[#1F2937] mb-2">Document Management - Sharing Interface</h1>
          <p className="text-[10px] mb-2">Email, messaging apps, cloud storage, secure link</p>
          <div className="space-y-2 mb-2">
            <div className="flex items-center space-x-2">
              <Mail size={16} className="text-[#1E3A8A]" />
              <span className="text-[10px]">Send via Email</span>
            </div>
            <div className="flex items-center space-x-2">
              <Link size={16} className="text-[#1E3A8A]" />
              <span className="text-[10px]">Generate Secure Link</span>
            </div>
          </div>
          <p className="text-[10px] mb-2">Privacy controls and recipient management</p>
          <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold">Share</button>
        </div>
      )}
    </div>
  );
};

export default PDFPlanExportThumbnail;