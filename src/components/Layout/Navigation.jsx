import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, BarChart3, FileDown, Settings } from 'lucide-react';

const Navigation = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/chat', icon: MessageCircle, label: 'Chat' },
        { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
        { path: '/export', icon: FileDown, label: 'Export' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <nav className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex space-x-8">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center space-x-2 py-4 border-b-2 transition-all duration-200 min-h-11 ${location.pathname === path
                                    ? 'border-blue-800 text-blue-800 font-semibold'
                                    : 'border-transparent text-gray-500 font-medium hover:text-gray-900'
                                }`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-base">{label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;

