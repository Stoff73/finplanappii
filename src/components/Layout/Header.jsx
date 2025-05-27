import React from 'react';
import { Calculator } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-2 pb-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-800 rounded-xl flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Financial Planning Assistant
                        </h1>
                    </div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        MVP Version 1.0
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

