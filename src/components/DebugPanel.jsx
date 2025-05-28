import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import dataExtractionService from '../services/dataExtraction';

const DebugPanel = () => {
    const { messages, extractedData, addMessage } = useApp();
    const [testInput, setTestInput] = useState('I earn 55k at my job, rent is 2,300 per month, 500 spent on beer and I want to retire at 65');

    const handleTestExtraction = () => {
        // Add the test message
        addMessage({
            type: 'user',
            content: testInput
        });
    };

    const handleDirectTest = () => {
        // Test the extraction service directly
        const testMessages = [
            { type: 'user', content: testInput, timestamp: Date.now() }
        ];

        const result = dataExtractionService.extractFinancialData(testMessages);
        console.log('Direct extraction test result:', result);
        alert('Check console for direct extraction results');
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">🐛 Debug Panel</h3>

            {/* Current State */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded border">
                    <h4 className="font-medium text-gray-900 mb-2">Messages ({messages.length})</h4>
                    <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
                        {messages.map((msg, idx) => (
                            <div key={idx} className="mb-1">
                                <strong>{msg.type}:</strong> {msg.content?.substring(0, 50)}...
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-3 rounded border">
                    <h4 className="font-medium text-gray-900 mb-2">Extracted Data</h4>
                    <div className="text-xs text-gray-600">
                        <div>Income: {extractedData?.income?.length || 0} items</div>
                        <div>Expenses: {extractedData?.expenses?.length || 0} items</div>
                        <div>Goals: {extractedData?.goals?.length || 0} items</div>
                        <div>Risk: {extractedData?.riskTolerance ? 'Set' : 'Not set'}</div>
                    </div>
                </div>
            </div>

            {/* Test Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Input:
                </label>
                <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    rows={2}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button
                    onClick={handleTestExtraction}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                    Add as Chat Message
                </button>
                <button
                    onClick={handleDirectTest}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                    Test Direct Extraction
                </button>
                <button
                    onClick={() => {
                        console.log('Current messages:', messages);
                        console.log('Current extracted data:', extractedData);
                    }}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                >
                    Log Current State
                </button>
            </div>

            <div className="mt-3 text-xs text-yellow-700">
                💡 This panel helps debug data extraction. Remove it in production.
            </div>
        </div>
    );
};

export default DebugPanel;