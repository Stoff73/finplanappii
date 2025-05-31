import React from 'react';
import PDFExport from '../components/PDF/PDFExport';
import { FileText, HelpCircle, Download, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Export = () => {
  const { selectedGoal, goalDefinitions, getCompletionScore } = useApp();
  const completionScore = getCompletionScore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Your Financial Plan</h1>
        <p className="text-gray-600">
          Generate a comprehensive PDF of your financial plan based on the information you've provided.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Export Component */}
        <div className="lg:col-span-2">
          <PDFExport />
        </div>

        {/* Sidebar with Additional Information */}
        <div className="space-y-6">
          {/* When to Export */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Download className="w-5 h-5 mr-2 text-blue-600" />
              When to Export
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>After completing your financial profile (70%+ completion recommended)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>When you've defined clear financial goals</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Before meeting with a financial advisor</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>To track your progress over time (export periodically)</span>
              </li>
            </ul>
          </div>

          {/* What's Included */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              What's Included
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">1</div>
                <span>Financial summary and profile completion</span>
              </li>
              <li className="flex items-start">
                <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">2</div>
                <span>Income and expense breakdown</span>
              </li>
              <li className="flex items-start">
                <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">3</div>
                <span>Financial goals and timeline</span>
              </li>
              <li className="flex items-start">
                <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">4</div>
                <span>Assets and debts overview</span>
              </li>
              <li className="flex items-start">
                <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">5</div>
                <span>Risk profile assessment</span>
              </li>
              <li className="flex items-start">
                <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">6</div>
                <span>Financial insights and recommendations</span>
              </li>
              <li className="flex items-start">
                <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">7</div>
                <span>Actionable next steps</span>
              </li>
            </ul>
          </div>

          {/* Tips & Notes */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
              Tips & Notes
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              {completionScore < 70 ? (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800">
                    <span className="font-medium">Your profile is {completionScore}% complete.</span> Adding more financial information will result in a more comprehensive plan.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800">
                    <span className="font-medium">Great job!</span> Your profile is {completionScore}% complete, which will result in a detailed financial plan.
                  </p>
                </div>
              )}

              {selectedGoal && goalDefinitions[selectedGoal] && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800">
                    <span className="font-medium">Goal-focused plan:</span> Your financial plan will be tailored to your {goalDefinitions[selectedGoal].label.toLowerCase()} goal.
                  </p>
                </div>
              )}

              <p>
                <span className="font-medium">Privacy note:</span> Your financial plan is generated locally and is not stored on our servers. The PDF is only saved to your device.
              </p>

              <p>
                <span className="font-medium">Disclaimer:</span> This financial plan is for informational purposes only and does not constitute professional financial advice. Consider consulting with a qualified financial advisor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;
