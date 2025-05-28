import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import pdfGenerator from '../../services/pdfGenerator';
import { FileDown, Loader2, CheckCircle, AlertCircle, Lock } from 'lucide-react';

const PDFExport = () => {
    const { userData, extractedData, insights, getCompletionScore } = useApp();
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState(null);

    const completionScore = getCompletionScore();

    const handleGeneratePDF = async () => {
        setIsGenerating(true);
        setStatus(null);

        try {
            // Generate PDF
            const doc = pdfGenerator.generateFinancialPlan(userData, extractedData, insights);

            // Generate filename with current date
            const date = new Date().toISOString().split('T')[0];
            const filename = `financial-plan-${date}.pdf`;

            // Download PDF
            doc.save(filename);

            setStatus({
                type: 'success',
                message: 'PDF generated successfully!'
            });
        } catch (error) {
            console.error('PDF generation failed:', error);
            setStatus({
                type: 'error',
                message: 'Failed to generate PDF. Please try again.'
            });
        } finally {
            setIsGenerating(false);
        }
    };

    // Require at least 70% completion for PDF generation
    const canGeneratePDF = completionScore >= 70;
    const progressColor = completionScore >= 70 ? 'bg-green-500' : completionScore >= 50 ? 'bg-blue-600' : 'bg-gray-400';

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileDown className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Export Financial Plan</h3>
            </div>

            {/* Status Message */}
            {status && (
                <div className={`p-4 rounded-xl mb-6 flex items-center space-x-3 ${status.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                    {status.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${status.type === 'success' ? 'text-green-800' : 'text-red-800'
                        }`}>
                        {status.message}
                    </span>
                </div>
            )}

            {/* Completion Status */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Plan Completeness</span>
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">{completionScore}%</span>
                        {completionScore >= 70 && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${completionScore}%` }}
                    >
                        <div className="h-full bg-white bg-opacity-20 rounded-full"></div>
                    </div>
                </div>

                {/* Progress Messages */}
                <div className="mt-3">
                    {completionScore < 70 && (
                        <div className="flex items-center space-x-2">
                            <Lock className="w-4 h-4 text-orange-500" />
                            <p className="text-sm text-orange-700 font-medium">
                                {70 - completionScore}% more needed to unlock PDF generation
                            </p>
                        </div>
                    )}
                    {completionScore >= 70 && completionScore < 90 && (
                        <p className="text-sm text-green-700 font-medium">
                            ✓ Ready to generate! Your plan will include comprehensive recommendations.
                        </p>
                    )}
                    {completionScore >= 90 && (
                        <p className="text-sm text-green-700 font-medium">
                            ✓ Excellent! Your plan will be highly detailed with personalized strategies.
                        </p>
                    )}
                </div>
            </div>

            {/* Requirements Notice */}
            {!canGeneratePDF && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <h4 className="font-semibold text-orange-900 mb-2">Complete Your Profile</h4>
                    <p className="text-sm text-orange-800 mb-3">
                        You need at least 70% profile completion to generate a comprehensive financial plan PDF.
                    </p>
                    <div className="text-sm text-orange-700">
                        <p className="font-medium mb-1">Still needed:</p>
                        <ul className="space-y-1 ml-4">
                            {!extractedData?.income?.length && <li>• Share your income details</li>}
                            {!extractedData?.expenses?.length && <li>• Mention your monthly expenses</li>}
                            {!extractedData?.goals?.length && <li>• Tell us your financial goals</li>}
                            {!extractedData?.riskTolerance && <li>• Describe your investment risk preference</li>}
                        </ul>
                    </div>
                </div>
            )}

            {/* What's Included */}
            <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Your PDF will include:</h4>
                <div className="grid gap-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">Executive summary of your financial situation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">Analysis of your income and expenses</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">Detailed breakdown of your financial goals</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">Personalized recommendations and next steps</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">Professional formatting suitable for sharing</span>
                    </div>
                </div>
            </div>

            {/* Generate Button */}
            <button
                onClick={handleGeneratePDF}
                disabled={!canGeneratePDF || isGenerating}
                className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${canGeneratePDF && !isGenerating
                        ? 'bg-blue-800 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Your Financial Plan...</span>
                    </>
                ) : canGeneratePDF ? (
                    <>
                        <FileDown className="w-5 h-5" />
                        <span>Generate Financial Plan PDF</span>
                    </>
                ) : (
                    <>
                        <Lock className="w-5 h-5" />
                        <span>Complete Profile to Generate PDF</span>
                    </>
                )}
            </button>

            {/* Help Text */}
            <div className="mt-4 text-center">
                {!canGeneratePDF ? (
                    <p className="text-sm text-gray-500">
                        <a href="/chat" className="text-blue-600 hover:text-blue-700 font-medium">
                            Continue chatting
                        </a> to reach 70% completion
                    </p>
                ) : (
                    <p className="text-sm text-gray-500">
                        Your personalized financial plan will be downloaded as a PDF
                    </p>
                )}
            </div>
        </div>
    );
};

export default PDFExport;
