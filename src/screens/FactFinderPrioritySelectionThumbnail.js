import React, { useState } from 'react';
import { Check, Briefcase, PieChart, BarChart } from 'lucide-react';

const priorities = [
  {
    id: 'pensions',
    title: 'Pensions',
    description: 'Plan your retirement savings and income.',
    icon: Briefcase,
  },
  {
    id: 'investments',
    title: 'Investments',
    description: 'Manage your investment portfolio effectively.',
    icon: PieChart,
  },
  {
    id: 'general',
    title: 'General Planning',
    description: 'Comprehensive financial planning advice.',
    icon: BarChart,
  },
];

const FactFinderPrioritySelectionThumbnail = () => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-64 h-96 bg-[#F9FAFB] rounded-lg shadow-lg p-4 flex flex-col relative text-xs font-sans">
      {/* Screen number */}
      <div className="absolute top-2 left-2 text-xs font-semibold text-gray-500 select-none">Screen 2</div>

      {/* Header */}
      <h1 className="text-sm font-bold text-[#1F2937] mb-4 leading-snug">
        What matters most to you right now?
      </h1>

      {/* Priority Cards */}
      <div className="space-y-2 flex-grow overflow-auto">
        {priorities.map(({ id, title, description, icon: Icon }) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggleSelect(id)}
              className={`w-full flex items-center h-12 bg-white rounded-md shadow-sm border-l-4 transition-transform duration-150 ease-in-out
                ${isSelected ? 'border-blue-700 scale-98 shadow-md' : 'border-transparent hover:scale-98 hover:shadow-sm'}
              `}
              style={{ borderLeftWidth: '4px' }}
              aria-pressed={isSelected}
            >
              <div className="ml-3 mr-3 text-blue-700">
                <Icon size={20} />
              </div>
              <div className="flex flex-col text-left flex-grow">
                <h3 className="text-xs font-semibold text-[#1F2937]">{title}</h3>
                <p className="text-[10px] text-gray-600 truncate">{description}</p>
              </div>
              <div className="mr-3">
                {isSelected && <Check size={16} className="text-blue-700 animate-checkmark" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      {selected.length > 0 && (
        <button
          className="mt-4 bg-[#1E3A8A] text-white font-semibold rounded-md h-9 shadow px-4 transition-transform duration-300 ease-out transform translate-y-0 text-xs"
          onClick={() => alert('Continue clicked with selections: ' + selected.join(', '))}
        >
          Continue
        </button>
      )}

      {/* Skip Option */}
      <button
        className="mt-2 text-[#1E3A8A] font-medium underline text-xs"
        onClick={() => alert('Skip clicked')}
      >
        I'm not sure
      </button>

      <style jsx>{`
        .scale-98 {
          transform: scale(0.98);
        }
        .animate-checkmark {
          animation: checkmark 300ms ease forwards;
        }
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 16;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FactFinderPrioritySelectionThumbnail;