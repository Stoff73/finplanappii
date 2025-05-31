import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import pdfGeneratorService from '../../services/pdfGenerator';
import { FileText, Check, AlertCircle, Download, Loader } from 'lucide-react';

const PDFExport = () => {
  const { 
    extractedData, 
    insights, 
    user, 
    getCompletionScore,
    selectedGoal,
    goalDefinitions
  } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [completionScore, setCompletionScore] = useState(0);
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    income: true,
    expenses: true,
    goals: true,
    assets: true,
    debts: true,
    riskProfile: true,
    insights: true,
    nextSteps: true
  });

  // Check if each section has data
  const sectionHasData = {
    income: extractedData?.income?.length > 0,
    expenses: extractedData?.expenses?.length > 0,
    goals: extractedData?.goals?.length > 0,
    assets: extractedData?.assets?.length > 0,
    debts: extractedData?.debts?.length > 0,
    riskProfile: !!extractedData?.riskTolerance,
    insights: insights?.length > 0
  };

  // Calculate completion score
  useEffect(() => {
    const score = getCompletionScore();
    setCompletionScore(score);
  }, [extractedData, getCompletionScore]);

  // Toggle section selection
  const toggleSection = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Select all sections
  const selectAllSections = () => {
    const allSections = {};
    Object.keys(selectedSections).forEach(section => {
      allSections[section] = true;
    });
    setSelectedSections(allSections);
  };

  // Deselect all sections
  const deselectAllSections = () => {
    const allSections = {};
    Object.keys(selectedSections).forEach(section => {
      allSections[section] = false;
    });
    // Always keep summary and next steps selected
    allSections.summary = true;
    allSections.nextSteps = true;
    setSelectedSections(allSections);
  };

  // Check if any data section is selected
  const hasSelectedDataSections = () => {
    return selectedSections.income || 
           selectedSections.expenses || 
           selectedSections.goals || 
           selectedSections.assets || 
           selectedSections.debts || 
           selectedSections.riskProfile || 
           selectedSections.insights;
  };

  // Generate PDF
  const handleGeneratePDF = async () => {
    try {
      // Reset states
      setError(null);
      setSuccess(false);
      
      // Validate completion score
      if (completionScore < 30) {
        setError('Please provide more financial information before generating a PDF. Your profile is less than 30% complete.');
        return;
      }

      // Validate selected sections
      if (!hasSelectedDataSections()) {
        setError('Please select at least one data section to include in the PDF.');
        return;
      }

      // Start generating
      setIsGenerating(true);

      // Filter data based on selected sections
      const filteredData = {
        ...extractedData,
        income: selectedSections.income ? extractedData.income : [],
        expenses: selectedSections.expenses ? extractedData.expenses : [],
        goals: selectedSections.goals ? extractedData.goals : [],
        assets: selectedSections.assets ? extractedData.assets : [],
        debts: selectedSections.debts ? extractedData.debts : [],
        riskTolerance: selectedSections.riskProfile ? extractedData.riskTolerance : null,
        insights: selectedSections.insights ? insights : [],
        completionScore: completionScore
      };

      // Prepare user data
      const userData = {
        name: user?.name || 'Financial Plan User',
        email: user?.email,
        isGuest: user?.isGuest
      };

      // Prepare options
      let filename = 'Financial_Plan';
      
      // Add goal context to filename if present
      if (selectedGoal && goalDefinitions[selectedGoal]) {
        filename += `_${goalDefinitions[selectedGoal].label.replace(/\s+/g, '_')}`;
      }
      
      filename += '.pdf';

      const options = {
        filename: filename,
        includeTimestamp: true
      };

      // Generate and download PDF
      await pdfGeneratorService.generateAndDownloadPDF(filteredData, userData, options);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
      setError(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center mb-6">
        <FileText className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-semibold text-gray-800">Export Financial Plan</h2>
      </div>

      {/* Completion Score */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Profile Completion</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full ${
              completionScore < 30 ? 'bg-red-500' : 
              completionScore < 70 ? 'bg-yellow-500' : 
              'bg-green-500'
            }`} 
            style={{ width: `${completionScore}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-sm text-gray-600">
          <span>0%</span>
          <span>{completionScore}%</span>
          <span>100%</span>
        </div>
        
        {completionScore < 70 && (
          <div className="mt-2 text-sm flex items-start">
            <AlertCircle className="w-4 h-4 text-yellow-500 mr-1 flex-shrink-0 mt-0.5" />
            <p className="text-gray-600">
              For a more comprehensive financial plan, consider adding more information to reach at least 70% completion.
            </p>
          </div>
        )}
      </div>

      {/* Section Selection */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-700">Sections to Include</h3>
          <div className="flex space-x-2">
            <button 
              onClick={selectAllSections}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Select All
            </button>
            <span className="text-gray-400">|</span>
            <button 
              onClick={deselectAllSections}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Summary Section (always included) */}
          <div className="flex items-center p-3 border rounded-lg bg-gray-50">
            <input
              type="checkbox"
              id="summary"
              checked={selectedSections.summary}
              onChange={() => toggleSection('summary')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={true}
            />
            <label htmlFor="summary" className="ml-3 text-gray-700 font-medium">
              Financial Summary
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Required</span>
            </label>
          </div>

          {/* Income Section */}
          <div className={`flex items-center p-3 border rounded-lg ${sectionHasData.income ? 'bg-white' : 'bg-gray-50'}`}>
            <input
              type="checkbox"
              id="income"
              checked={selectedSections.income}
              onChange={() => toggleSection('income')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={!sectionHasData.income}
            />
            <label htmlFor="income" className="ml-3 text-gray-700 font-medium flex items-center justify-between w-full">
              <span>Income</span>
              {sectionHasData.income ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {extractedData.income.length} item{extractedData.income.length !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">No data</span>
              )}
            </label>
          </div>

          {/* Expenses Section */}
          <div className={`flex items-center p-3 border rounded-lg ${sectionHasData.expenses ? 'bg-white' : 'bg-gray-50'}`}>
            <input
              type="checkbox"
              id="expenses"
              checked={selectedSections.expenses}
              onChange={() => toggleSection('expenses')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={!sectionHasData.expenses}
            />
            <label htmlFor="expenses" className="ml-3 text-gray-700 font-medium flex items-center justify-between w-full">
              <span>Expenses</span>
              {sectionHasData.expenses ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {extractedData.expenses.length} item{extractedData.expenses.length !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">No data</span>
              )}
            </label>
          </div>

          {/* Goals Section */}
          <div className={`flex items-center p-3 border rounded-lg ${sectionHasData.goals ? 'bg-white' : 'bg-gray-50'}`}>
            <input
              type="checkbox"
              id="goals"
              checked={selectedSections.goals}
              onChange={() => toggleSection('goals')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={!sectionHasData.goals}
            />
            <label htmlFor="goals" className="ml-3 text-gray-700 font-medium flex items-center justify-between w-full">
              <span>Financial Goals</span>
              {sectionHasData.goals ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {extractedData.goals.length} goal{extractedData.goals.length !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">No data</span>
              )}
            </label>
          </div>

          {/* Assets Section */}
          <div className={`flex items-center p-3 border rounded-lg ${sectionHasData.assets ? 'bg-white' : 'bg-gray-50'}`}>
            <input
              type="checkbox"
              id="assets"
              checked={selectedSections.assets}
              onChange={() => toggleSection('assets')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={!sectionHasData.assets}
            />
            <label htmlFor="assets" className="ml-3 text-gray-700 font-medium flex items-center justify-between w-full">
              <span>Assets</span>
              {sectionHasData.assets ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {extractedData.assets.length} item{extractedData.assets.length !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">No data</span>
              )}
            </label>
          </div>

          {/* Debts Section */}
          <div className={`flex items-center p-3 border rounded-lg ${sectionHasData.debts ? 'bg-white' : 'bg-gray-50'}`}>
            <input
              type="checkbox"
              id="debts"
              checked={selectedSections.debts}
              onChange={() => toggleSection('debts')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={!sectionHasData.debts}
            />
            <label htmlFor="debts" className="ml-3 text-gray-700 font-medium flex items-center justify-between w-full">
              <span>Debts</span>
              {sectionHasData.debts ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {extractedData.debts.length} item{extractedData.debts.length !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">No data</span>
              )}
            </label>
          </div>

          {/* Risk Profile Section */}
          <div className={`flex items-center p-3 border rounded-lg ${sectionHasData.riskProfile ? 'bg-white' : 'bg-gray-50'}`}>
            <input
              type="checkbox"
              id="riskProfile"
              checked={selectedSections.riskProfile}
              onChange={() => toggleSection('riskProfile')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={!sectionHasData.riskProfile}
            />
            <label htmlFor="riskProfile" className="ml-3 text-gray-700 font-medium flex items-center justify-between w-full">
              <span>Risk Profile</span>
              {sectionHasData.riskProfile ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {extractedData.riskTolerance.level} risk
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">No data</span>
              )}
            </label>
          </div>

          {/* Insights Section */}
          <div className={`flex items-center p-3 border rounded-lg ${sectionHasData.insights ? 'bg-white' : 'bg-gray-50'}`}>
            <input
              type="checkbox"
              id="insights"
              checked={selectedSections.insights}
              onChange={() => toggleSection('insights')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={!sectionHasData.insights}
            />
            <label htmlFor="insights" className="ml-3 text-gray-700 font-medium flex items-center justify-between w-full">
              <span>Financial Insights</span>
              {sectionHasData.insights ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {insights.length} insight{insights.length !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">No data</span>
              )}
            </label>
          </div>

          {/* Next Steps Section (always included) */}
          <div className="flex items-center p-3 border rounded-lg bg-gray-50">
            <input
              type="checkbox"
              id="nextSteps"
              checked={selectedSections.nextSteps}
              onChange={() => toggleSection('nextSteps')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={true}
            />
            <label htmlFor="nextSteps" className="ml-3 text-gray-700 font-medium">
              Next Steps
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Required</span>
            </label>
          </div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm">Financial plan PDF generated successfully!</p>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGeneratePDF}
          disabled={isGenerating || completionScore < 30 || !hasSelectedDataSections()}
          className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white ${
            isGenerating || completionScore < 30 || !hasSelectedDataSections()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors duration-200`}
        >
          {isGenerating ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Generate Financial Plan PDF
            </>
          )}
        </button>
      </div>

      {/* Additional Information */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">About Financial Plan Export</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your financial plan PDF will include a summary of your financial situation based on the information you've provided. 
          The more complete your profile, the more comprehensive your financial plan will be.
        </p>
        
        {selectedGoal && goalDefinitions[selectedGoal] && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Goal-Specific Plan:</span> Your PDF will be tailored to your selected goal: {goalDefinitions[selectedGoal].label}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFExport;
