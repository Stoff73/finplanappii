import React from 'react';
import Header from './Header';
import Navigation from './Navigation';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;

