import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, Share2, Loader2 } from 'lucide-react';

const PlanGenerationThumbnail = () => {
  const [state, setState] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (state === 2 && progress < 100) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setState(3);
            return 100;
          }
          return prev + 5;
        });
      }, 200);
    }
    return () => clearInterval(timer);
  }, [state, progress]);

  return (
    <div className="w-64 h-[28rem] bg-[#F9FAFB] rounded-lg shadow-lg p-4 flex flex-col relative text-xs font-sans overflow-hidden">
      {/* Screen number */}
      <div className="absolute top-2 left-2 text-xs font-semibold text-gray-500 select-none">Screen 3</div>

      {/* State selector */}
      <div className="flex justify-center space-x-2 mb-3">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => { setState(s); if (s !== 2) setProgress(0); }}
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
        <div className="flex flex-col space-y-3">
          <h1 className="text-sm font-bold text-[#1F2937]">Ready to generate your plan?</h1>
          <div className="bg-white rounded-md shadow p-3 text-[10px] text-gray-700">
            <p><strong>Conversation Completeness:</strong> 85%</p>
            <p><strong>Key Facts:</strong> Income, Expenses, Goals</p>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="planType" defaultChecked />
              <span className="text-[10px]">Full comprehensive plan</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="planType" />
              <span className="text-[10px]">Focus areas only</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="planType" />
              <span className="text-[10px]">Quick summary version</span>
            </label>
          </div>
          <button
            className="mt-4 bg-[#1E3A8A] text-white font-semibold rounded-md h-9 shadow px-4 text-xs"
            onClick={() => setState(2)}
          >
            Create My Financial Plan
          </button>
          <p className="text-[10px] text-gray-500 mt-1">This usually takes 2-3 minutes</p>
        </div>
      )}

      {state === 2 && (
        <div className="flex flex-col space-y-3 items-center justify-center flex-grow">
          <Loader2 className="animate-spin text-[#1E3A8A]" size={32} />
          <p className="text-[10px] text-gray-700">Data analysis phase</p>
          <div className="w-full bg-white rounded-full h-2 overflow-hidden shadow">
            <div
              className="bg-[#1E3A8A] h-2 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1">Estimated time remaining: {Math.max(0, 60 - Math.floor(progress * 0.6))}s</p>
          <button
            className="mt-4 text-[#1E3A8A] underline text-xs"
            onClick={() => setState(1)}
          >
            Cancel
          </button>
        </div>
      )}

      {state === 3 && (
        <div className="flex flex-col space-y-3 items-center justify-center flex-grow">
          <CheckCircle className="text-[#10B981]" size={48} />
          <p className="text-sm font-semibold text-[#1F2937]">Plan Generation Complete!</p>
          <div className="bg-white rounded-md shadow p-3 w-full text-[10px] text-gray-700">
            <p><strong>Generated:</strong> 22 May 2025</p>
            <p><strong>Version:</strong> 1.0</p>
            <p><strong>Pages:</strong> 12</p>
          </div>
          <div className="flex space-x-2 mt-2">
            <button className="bg-[#1E3A8A] text-white rounded-md px-3 py-1 text-xs font-semibold shadow">
              View My Plan
            </button>
            <button className="bg-white border border-[#1E3A8A] text-[#1E3A8A] rounded-md px-3 py-1 text-xs font-semibold shadow">
              Download PDF
            </button>
            <button className="text-[#1E3A8A] underline text-xs font-semibold">
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanGenerationThumbnail;