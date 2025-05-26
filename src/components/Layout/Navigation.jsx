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
        <nav className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex space-x-8">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${location.pathname === path
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;

