import React from 'react';
import PDFExport from '../components/PDF/PDFExport';
import { useApp } from '../context/AppContext';

const Export = () => {
    const { messages } = useApp();
    const hasData = messages.length > 1;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Export Your Financial Plan</h1>

            {hasData ? (
                <PDFExport />
            ) : (
                <div className="card text-center">
                    <h3 className="text-lg font-semibold mb-4">No Financial Data Available</h3>
                    <p className="text-gray-600 mb-6">
                        Start a conversation with our AI assistant to build your financial profile,
                        then return here to generate your personalized financial plan PDF.
                    </p>
                    <a href="/chat" className="btn-primary">
                        Start Financial Chat
                    </a>
                </div>
            )}
        </div>
    );
};

export default Export;
