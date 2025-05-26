import React from 'react';
import Header from './Header';
import Navigation from './Navigation';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background-subtle">
            <Header />
            <Navigation />
            <main className="max-w-7xl mx-auto screen-margins section-spacing py-32">
                {children}
            </main>
        </div>
    );
};

export default Layout;


