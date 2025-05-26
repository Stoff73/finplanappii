import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Upload, Trash2, RefreshCw } from 'lucide-react';

const DataManager = () => {
    const { userData, extractedData, messages, clearAllData } = useApp();
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const exportData = () => {
        const dataToExport = {
            userData,
            extractedData,
            messages,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const handleClearData = () => {
        if (showClearConfirm) {
            clearAllData();
            setShowClearConfirm(false);
        } else {
            setShowClearConfirm(true);
        }
    };

    const dataStats = {
        messages: messages.length,
        goals: extractedData.goals?.length || 0,
        incomeEntries: extractedData.income?.length || 0,
        expenseEntries: extractedData.expenses?.length || 0
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">Data Management</h3>

            {/* Data Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">{dataStats.messages}</div>
                    <div className="text-sm text-gray-600">Messages</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">{dataStats.goals}</div>
                    <div className="text-sm text-gray-600">Goals</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">{dataStats.incomeEntries}</div>
                    <div className="text-sm text-gray-600">Income Entries</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">{dataStats.expenseEntries}</div>
                    <div className="text-sm text-gray-600">Expense Entries</div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                <button
                    onClick={exportData}
                    className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    <Download className="w-4 h-4" />
                    <span>Export Data (JSON)</span>
                </button>

                <button
                    onClick={handleClearData}
                    className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg ${showClearConfirm
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'border border-red-300 text-red-600 hover:bg-red-50'
                        }`}
                >
                    <Trash2 className="w-4 h-4" />
                    <span>{showClearConfirm ? 'Confirm - Clear All Data' : 'Clear All Data'}</span>
                </button>

                {showClearConfirm && (
                    <button
                        onClick={() => setShowClearConfirm(false)}
                        className="w-full p-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                )}
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-800">
                    Your data is stored locally in your browser. Export regularly to avoid data loss.
                </p>
            </div>
        </div>
    );
};

export default DataManager;
