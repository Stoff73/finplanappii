import React, { useState } from 'react';
import { User } from 'lucide-react';

const WelcomeScreenThumbnail = () => {
  const [showGuestModal, setShowGuestModal] = useState(false);

  return (
    <div className="w-64 h-96 bg-gradient-to-b from-[#F9FAFB] to-[#FFFFFF] rounded-lg shadow-lg p-4 flex flex-col items-center justify-center relative text-xs font-sans">
      {/* Screen number */}
      <div className="absolute top-2 left-2 text-xs font-semibold text-gray-500 select-none">Screen 1</div>

      {/* Hero Section */}
      <h1 className="text-sm font-bold text-[#1F2937] mb-4 text-center leading-snug">
        Financial planning<br />designed for your life
      </h1>

      {/* Buttons */}
      <div className="flex flex-col items-center space-y-2 w-full">
        <button
          onClick={() => alert('Start Your Financial Journey clicked')}
          className="bg-[#1E3A8A] text-white rounded-md shadow px-3 py-2 w-full text-center font-semibold"
          style={{ height: '32px', borderRadius: '8px' }}
        >
          Start Your Financial Journey
        </button>
        <button
          onClick={() => setShowGuestModal(true)}
          className="border-2 border-[#1E3A8A] text-[#1E3A8A] rounded-md px-3 py-2 w-full text-center font-semibold"
          style={{ height: '32px', borderRadius: '8px' }}
        >
          Explore as Guest
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="flex space-x-3 mt-4 text-gray-500 select-none text-[10px] font-medium">
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
          <span>FCA Regulated</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          <span>Bank-Level Security</span>
        </div>
      </div>

      {/* Guest Mode Explanation Modal */}
      {showGuestModal && (
        <div
          className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowGuestModal(false)}
        >
          <div
            className="bg-white rounded-xl p-4 max-w-xs w-full relative scale-90 animate-scaleIn"
            onClick={e => e.stopPropagation()}
            style={{ borderRadius: '20px', padding: '16px' }}
          >
            <div className="flex flex-col items-center space-y-2 text-xs">
              <User className="text-[#1E3A8A]" size={20} />
              <h3 className="text-lg font-semibold text-[#1E3A8A] text-center">Explore Without Commitment</h3>
              <ul className="list-disc list-inside text-[#1E3A8A] space-y-1">
                <li>Limited access to features</li>
                <li>Data not saved permanently</li>
                <li>Upgrade anytime to save progress</li>
              </ul>
              <p className="text-gray-500 text-xs mt-1 text-center">Create an account anytime to save your progress</p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => alert('Continue as Guest')}
                  className="bg-[#1E3A8A] text-white rounded-lg px-3 py-1 font-semibold shadow-md text-xs"
                  style={{ height: '36px', borderRadius: '12px' }}
                >
                  Continue as Guest
                </button>
                <button
                  onClick={() => alert('Create Account Instead')}
                  className="text-[#1E3A8A] font-semibold px-3 py-1 rounded-lg text-xs"
                  style={{ height: '36px' }}
                >
                  Create Account Instead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreenThumbnail;