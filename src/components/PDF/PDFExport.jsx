import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import pdfGenerator from '../../services/pdfGenerator';
import { FileDown, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

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

    const canGeneratePDF = completionScore >= 30; // Require at least 30% completion

    return (
        <div className="card">
            <div className="flex items-center space-x-3 mb-4">
                <FileDown className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-semibold">Export Financial Plan</h3>
            </div>

            {/* Status Message */}
            {status && (
                <div className={`p-3 rounded-lg mb-4 flex items-center space-x-2 ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                    {status.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm">{status.message}</span>
                </div>
            )}

            {/* Completion Status */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Plan Completeness</span>
                    <span className="text-sm font-semibold text-gray-900">{completionScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionScore}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                    {completionScore < 30 && "Share more financial information to generate a comprehensive plan."}
                    {completionScore >= 30 && completionScore < 70 && "Good progress! Your plan will include basic recommendations."}
                    {completionScore >= 70 && "Excellent! Your plan will be comprehensive with detailed recommendations."}
                </p>
            </div>

            {/* What's Included */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Your PDF will include:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span>Executive summary of your financial situation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span>Analysis of your income and expenses</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span>Detailed breakdown of your financial goals</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span>Personalized recommendations and next steps</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span>Professional formatting suitable for sharing</span>
                    </li>
                </ul>
            </div>

            {/* Generate Button */}
            <button
                onClick={handleGeneratePDF}
                disabled={!canGeneratePDF || isGenerating}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${canGeneratePDF && !isGenerating
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating PDF...</span>
                    </>
                ) : (
                    <>
                        <FileDown className="w-5 h-5" />
                        <span>
                            {canGeneratePDF ? 'Generate Financial Plan PDF' : 'Complete More Profile to Generate PDF'}
                        </span>
                    </>
                )}
            </button>

            {!canGeneratePDF && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Chat more about your finances to unlock PDF generation
                </p>
            )}
        </div>
    );
};

export default PDFExport;
