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

const FactFinderPrioritySelection = () => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-6 py-8 flex flex-col max-w-md mx-auto">
      {/* Screen number */}
      <div className="text-sm font-semibold text-gray-500 select-none mb-4">Screen 1</div>

      {/* Header */}
      <h1 className="text-2xl font-bold text-[#1F2937] mb-8 leading-tight">
        What matters most to you right now?
      </h1>

      {/* Priority Cards */}
      <div className="space-y-6 flex-grow">
        {priorities.map(({ id, title, description, icon: Icon }) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggleSelect(id)}
              className={`w-full flex items-center h-20 bg-white rounded-lg shadow-sm border-l-4 transition-transform duration-150 ease-in-out
                ${isSelected ? 'border-blue-700 scale-98 shadow-lg' : 'border-transparent hover:scale-98 hover:shadow-md'}
              `}
              style={{ borderLeftWidth: '4px' }}
              aria-pressed={isSelected}
            >
              <div className="ml-4 mr-6 text-blue-700">
                <Icon size={32} />
              </div>
              <div className="flex flex-col text-left flex-grow">
                <h3 className="text-lg font-semibold text-[#1F2937]">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <div className="mr-4">
                {isSelected && <Check size={24} className="text-blue-700 animate-checkmark" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      {selected.length > 0 && (
        <button
          className="mt-8 bg-[#1E3A8A] text-white font-semibold rounded-lg h-13 shadow-md px-6 transition-transform duration-300 ease-out transform translate-y-0"
          style={{ height: '52px', borderRadius: '12px' }}
          onClick={() => alert('Continue clicked with selections: ' + selected.join(', '))}
        >
          Continue
        </button>
      )}

      {/* Skip Option */}
      <button
        className="mt-4 text-[#1E3A8A] font-medium underline"
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

export default FactFinderPrioritySelection;