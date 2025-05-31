import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { MessageSquare, Target, Database, BarChart3, FileText, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
    const { messages, getCompletionScore } = useApp();

    const hasData = messages.length > 0;
    const completionScore = getCompletionScore();

    // Feature definitions
    const features = [
        {
            id: 'chat',
            title: 'AI-Powered Financial Chat',
            description: 'Engage in natural conversations with our UK financial planning specialist. Ask questions, share your financial information, and receive personalized guidance.',
            icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
            link: '/chat',
            linkText: 'Start a conversation',
            benefits: ['Natural language input for financial data', 'Personalized financial guidance', 'Contextual follow-up questions']
        },
        {
            id: 'goals',
            title: 'Goal Selection & Contextual Planning',
            description: 'Select your primary financial goals and receive tailored advice specific to your objectives, whether it\'s retirement, buying a house, or building an emergency fund.',
            icon: <Target className="w-8 h-8 text-indigo-600" />,
            link: '/chat',
            linkText: 'Set your financial goals',
            benefits: ['Goal-specific financial planning', 'Tailored advice for your priorities', 'Progress tracking toward objectives']
        },
        {
            id: 'data',
            title: 'Data Extraction & Processing',
            description: 'Our system automatically extracts and organizes your financial information from your conversations, saving you the hassle of filling out complex forms.',
            icon: <Database className="w-8 h-8 text-emerald-600" />,
            link: '/dashboard',
            linkText: 'View your financial data',
            benefits: ['Automatic data extraction from chat', 'Document upload for data extraction', 'Persistent data storage across sessions']
        },
        {
            id: 'dashboard',
            title: 'Financial Dashboard',
            description: 'Visualize your financial situation with our comprehensive dashboard. Track your progress, view key insights, and understand your financial health at a glance.',
            icon: <BarChart3 className="w-8 h-8 text-amber-600" />,
            link: '/dashboard',
            linkText: 'Explore your dashboard',
            benefits: ['Visual financial overview', 'Goal progress tracking', 'Key financial insights and metrics']
        },
        {
            id: 'export',
            title: 'PDF Export',
            description: 'Generate a comprehensive financial plan document based on your data. Share it with family members or financial advisors, or keep it for your records.',
            icon: <FileText className="w-8 h-8 text-red-600" />,
            link: '/export',
            linkText: 'Generate your plan',
            benefits: ['Comprehensive financial plan document', 'Shareable PDF format', 'Customizable sections and content']
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Your Personal Financial Planning Assistant
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Create a comprehensive financial plan through simple conversation. 
                    No complex forms, just chat naturally about your finances.
                </p>
                
                {hasData ? (
                    <div className="card p-6 max-w-lg mx-auto">
                        <h3 className="text-lg font-semibold mb-3">Welcome Back!</h3>
                        <div className="mb-4">
                            <p className="text-gray-700 mb-2">Your profile is <span className="font-bold">{completionScore}%</span> complete</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className={`h-2.5 rounded-full ${
                                        completionScore < 30 ? 'bg-red-500' : 
                                        completionScore < 70 ? 'bg-yellow-500' : 
                                        'bg-green-500'
                                    }`} 
                                    style={{ width: `${completionScore}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link to="/chat" className="btn-primary flex items-center justify-center">
                                Continue Planning <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                            <Link to="/dashboard" className="btn-secondary flex items-center justify-center">
                                View Dashboard <BarChart3 className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <Link to="/chat" className="btn-primary flex items-center justify-center text-lg px-8 py-3">
                            Get Started <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div className="space-y-16 mb-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Core Features</h2>
                
                {features.map((feature, index) => (
                    <div key={feature.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
                        <div className="md:w-1/2">
                            <div className={`bg-${index % 2 === 0 ? 'blue' : 'indigo'}-50 p-8 rounded-2xl flex items-center justify-center`}>
                                <div className="w-24 h-24 flex items-center justify-center">
                                    {feature.icon}
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                            <ul className="space-y-2">
                                {feature.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <Link to={feature.link} className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
                                    {feature.linkText} <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Getting Started Guide */}
            <div className="card p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mx-auto">1</div>
                        <h3 className="font-semibold text-lg">Chat About Your Finances</h3>
                        <p className="text-gray-600 text-sm">Have a natural conversation with our AI assistant about your financial situation and goals.</p>
                    </div>
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mx-auto">2</div>
                        <h3 className="font-semibold text-lg">Review Your Dashboard</h3>
                        <p className="text-gray-600 text-sm">See your financial data visualized with insights and progress toward your goals.</p>
                    </div>
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mx-auto">3</div>
                        <h3 className="font-semibold text-lg">Export Your Plan</h3>
                        <p className="text-gray-600 text-sm">Generate a comprehensive PDF financial plan to save or share.</p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
                <p className="text-gray-600 mb-6">Begin your financial planning journey today. No registration required.</p>
                <Link to="/chat" className="btn-primary inline-flex items-center justify-center">
                    Start Planning Now <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
};

export default Home;
