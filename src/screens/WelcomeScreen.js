import React, { useState } from 'react';
import { User } from 'lucide-react';

const WelcomeScreen = () => {
  const [showGuestModal, setShowGuestModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#FFFFFF] flex flex-col items-center justify-center px-4">
      {/* Screen number */}
      <div className="absolute top-4 left-4 text-sm font-semibold text-gray-500 select-none">Screen 1</div>

      {/* Hero Section */}
      <h1
        className="text-4xl font-bold text-[#1F2937] mb-12 opacity-0 animate-fadeIn"
        style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
      >
        Financial planning designed for your life
      </h1>

      {/* Buttons */}
      <div className="flex flex-col items-center space-y-4 opacity-0 animate-fadeIn" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
        <button
          onClick={() => alert('Start Your Financial Journey clicked')}
          className="bg-[#1E3A8A] text-white h-13 rounded-lg shadow-[0_2px_8px_rgba(30,58,138,0.12)] px-6 text-lg font-semibold"
          style={{ height: '52px', borderRadius: '12px' }}
        >
          Start Your Financial Journey
        </button>
        <button
          onClick={() => setShowGuestModal(true)}
          className="border-2 border-[#1E3A8A] text-[#1E3A8A] h-13 rounded-lg px-6 text-lg font-semibold"
          style={{ height: '52px', borderRadius: '12px' }}
        >
          Explore as Guest
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="flex space-x-6 mt-8 text-xs font-medium text-gray-500 select-none opacity-0 animate-fadeIn" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
          <span>FCA Regulated</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
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
            className="bg-white rounded-xl p-6 max-w-sm w-full relative scale-90 animate-scaleIn"
            onClick={e => e.stopPropagation()}
            style={{ borderRadius: '20px', padding: '24px' }}
          >
            <div className="flex flex-col items-center space-y-4">
              <User className="text-[#1E3A8A]" size={24} />
              <h3 className="text-2xl font-semibold text-[#1E3A8A]">Explore Without Commitment</h3>
              <ul className="list-disc list-inside text-[#1E3A8A] space-y-1">
                <li>Limited access to features</li>
                <li>Data not saved permanently</li>
                <li>Upgrade anytime to save progress</li>
              </ul>
              <p className="text-gray-500 text-sm mt-2">Create an account anytime to save your progress</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => alert('Continue as Guest')}
                  className="bg-[#1E3A8A] text-white rounded-lg px-6 py-3 font-semibold shadow-md"
                  style={{ height: '52px', borderRadius: '12px' }}
                >
                  Continue as Guest
                </button>
                <button
                  onClick={() => alert('Create Account Instead')}
                  className="text-[#1E3A8A] font-semibold px-6 py-3 rounded-lg"
                  style={{ height: '52px' }}
                >
                  Create Account Instead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
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

export default WelcomeScreen;