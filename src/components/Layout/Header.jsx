import React from 'react';
import { Calculator } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center space-x-2">
                    <Calculator className="h-8 w-8 text-primary-600" />
                    <h1 className="text-xl font-bold text-gray-900">
                        Financial Planning Assistant
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
