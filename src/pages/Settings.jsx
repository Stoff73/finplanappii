import React from 'react';
import DataManager from '../components/DataManagement/DataManager';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, User, Database, Info } from 'lucide-react';

const Settings = () => {
    const { getCompletionScore } = useApp();
    const completionScore = getCompletionScore();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Profile Information */}
                <div className="card">
                    <div className="flex items-center space-x-2 mb-4">
                        <User className="w-5 h-5 text-primary-600" />
                        <h3 className="text-lg font-semibold">Profile</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Completion Status
                            </label>
                            <div className="text-2xl font-bold text-primary-600">{completionScore}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full"
                                    style={{ width: `${completionScore}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${completionScore >= 70
                                    ? 'bg-green-100 text-green-800'
                                    : completionScore >= 30
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                {completionScore >= 70 ? 'Complete' : completionScore >= 30 ? 'In Progress' : 'Getting Started'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Data Management */}
                <div className="lg:col-span-2">
                    <DataManager />
                </div>
            </div>

            {/* App Information */}
            <div className="card mt-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Info className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold">About This Application</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• AI-powered financial conversations</li>
                            <li>• Automatic data extraction and analysis</li>
                            <li>• Interactive financial dashboard</li>
                            <li>• Professional PDF report generation</li>
                            <li>• Local data storage for privacy</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Privacy & Security</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• All data stored locally in your browser</li>
                            <li>• No personal data sent to external servers</li>
                            <li>• OpenAI API used only for chat responses</li>
                            <li>• You can export or delete your data anytime</li>
                            <li>• No account creation required</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
