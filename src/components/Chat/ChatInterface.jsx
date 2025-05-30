import './ChatInterface.css';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, Target, FileUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import openAIService from '../../services/openai';
import documentProcessingService from '../../services/documentProcessing';

const ChatInterface = () => {
    const { messages, addMessage, extractedData, selectedGoal, setSelectedGoal } = useApp();
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const [showGoalSelection, setShowGoalSelection] = useState(false);
    const [showFormOption, setShowFormOption] = useState(false);
    const [documentFile, setDocumentFile] = useState(null);
    const [hasInitialized, setHasInitialized] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Only scroll to bottom if we have messages and the component has initialized
        // Avoid scrolling on initial load
        if (hasInitialized && messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, isTyping, hasInitialized]);


    // Enhanced initial message with goal selection
    useEffect(() => {
        if (messages.length === 0) {
            addMessage({
                type: 'ai',
                content: 'Hello! I\'m your UK financial planning specialist. I can help you create a personalized plan for your most important financial goals.\n\nWhat would you like to focus on today?'
            });
            setShowGoalSelection(true);
        }
    }, [messages.length, addMessage]);

    const goalOptions = [
        { id: 'retirement', label: 'Plan for Retirement', icon: '🏖️', description: 'Pensions, investments, and retirement income' },
        { id: 'house', label: 'Buy a House', icon: '🏠', description: 'Mortgages, deposits, and first-time buyer schemes' },
        { id: 'emergency', label: 'Build Emergency Fund', icon: '🛡️', description: 'Financial security and peace of mind' },
        { id: 'investment', label: 'Start Investing', icon: '📈', description: 'ISAs, portfolios, and long-term growth' },
        { id: 'debt', label: 'Pay Off Debt', icon: '💳', description: 'Debt management and repayment strategies' },
        { id: 'education', label: 'Save for Education', icon: '🎓', description: 'University costs and education planning' }
    ];

    const handleGoalSelection = async (goalId) => {
        setSelectedGoal(goalId);
        setShowGoalSelection(false);

        const selectedGoalOption = goalOptions.find(g => g.id === goalId);

        // Add user's goal selection as a message
        addMessage({
            type: 'user',
            content: `I want help with: ${selectedGoalOption.label}`
        });

        // Show form vs conversation option
        setShowFormOption(true);

        // Add AI response about chosen goal
        setIsTyping(true);

        setTimeout(() => {
            let goalSpecificMessage = '';

            switch (goalId) {
                case 'retirement':
                    goalSpecificMessage = `Excellent choice! Retirement planning is crucial, and the UK has great pension tax benefits. I can help you maximize your workplace pension, understand tax relief, and plan for your ideal retirement age.\n\nWould you prefer to have a conversation about your retirement goals, or fill out a quick form to get started?`;
                    break;
                case 'house':
                    goalSpecificMessage = `Great goal! I'll help you navigate UK property buying, from calculating what you can afford to choosing the best first-time buyer schemes like Help to Buy ISAs or Lifetime ISAs.\n\nWould you like to chat about your house buying plans, or complete a structured form with the key details?`;
                    break;
                case 'emergency':
                    goalSpecificMessage = `Smart thinking! An emergency fund is the foundation of financial security. I'll help you determine the right amount (typically 3-6 months of expenses) and find the best UK savings accounts.\n\nShall we discuss your emergency fund needs through conversation, or would you prefer a quick form?`;
                    break;
                case 'investment':
                    goalSpecificMessage = `Perfect timing! With your £20,000 annual ISA allowance and current UK market opportunities, there are great tax-efficient investment options available.\n\nWould you like to explore investment options through conversation, or start with a structured questionnaire?`;
                    break;
                case 'debt':
                    goalSpecificMessage = `I'm here to help! We'll create a strategic debt repayment plan, potentially saving you thousands in interest. UK debt management has some great options.\n\nShall we discuss your debt situation conversationally, or would you prefer to complete a debt assessment form?`;
                    break;
                case 'education':
                    goalSpecificMessage = `Thoughtful planning! With UK university costs and Junior ISAs offering tax-free growth, early planning makes a huge difference.\n\nWould you like to chat about education planning, or fill out a quick form with the key details?`;
                    break;
                default:
                    goalSpecificMessage = `I'll provide comprehensive financial planning tailored to your goals. Let's start by understanding your current situation and priorities.\n\nHow would you prefer to share your information - through conversation or a structured form?`;
            }

            addMessage({
                type: 'ai',
                content: goalSpecificMessage
            });

            setIsTyping(false);
        }, 1500);
    };

    const handleFormChoice = (useForm) => {
        setShowFormOption(false);

        if (useForm) {
            addMessage({
                type: 'user',
                content: useForm ? 'I\'d prefer to fill out a form' : 'I\'d rather have a conversation'
            });

            // Add AI response about form (this would integrate with form components)
            addMessage({
                type: 'ai',
                content: `Perfect! I'll create a tailored form for your ${selectedGoal} planning. The form will ensure we capture all the important details efficiently, and you can always chat with me if you have questions.\n\n*[Form integration would appear here in full implementation]*\n\nFor now, let's continue with our conversation. What's your main question about ${goalOptions.find(g => g.id === selectedGoal)?.label.toLowerCase()}?`
            });
        } else {
            addMessage({
                type: 'user',
                content: 'I\'d rather have a conversation'
            });

            // Continue with conversational flow
            addMessage({
                type: 'ai',
                content: `Absolutely! I find conversations often work better as I can adapt to your specific situation. Let's start with the basics.\n\n${getGoalSpecificStarterQuestion(selectedGoal)}`
            });
        }
    };

    const getGoalSpecificStarterQuestion = (goalId) => {
        switch (goalId) {
            case 'retirement':
                return "What's your current age, and do you have a target retirement age in mind?";
            case 'house':
                return "Are you a first-time buyer, and do you have a rough idea of your target property price or area?";
            case 'emergency':
                return "What would you estimate your essential monthly expenses to be (rent, utilities, food, insurance)?";
            case 'investment':
                return "Are you currently using your £20,000 ISA allowance, and what's your investment timeline?";
            case 'debt':
                return "What types of debt do you currently have, and roughly what are the total amounts?";
            case 'education':
                return "How old is your child, and are you planning for university or other education costs?";
            default:
                return "What's your current annual income, and what are your main financial priorities?";
        }
    };

    const handleSend = async () => {
        if (!inputMessage.trim() || isTyping) return;

        setError(null);
        const userMessage = inputMessage.trim();
        setInputMessage('');
        setIsTyping(true);

        // Add user message
        addMessage({
            type: 'user',
            content: userMessage
        });

        try {
            // Use enhanced OpenAI service with goal context
            const result = await openAIService.sendMessage(
                userMessage,
                messages,
                selectedGoal
            );

            if (result && result.success) {
                addMessage({
                    type: 'ai',
                    content: result.message
                });

                if (result.isOffline) {
                    setError('Using offline mode - responses may be limited');
                }
            } else {
                // Enhanced fallback response
                addMessage({
                    type: 'ai',
                    content: result.message || openAIService.generateEnhancedFallback(userMessage, selectedGoal)
                });

                setError('AI service unavailable - using enhanced offline responses');
            }
        } catch (error) {
            console.error('Chat error:', error);
            addMessage({
                type: 'ai',
                content: openAIService.generateEnhancedFallback(userMessage, selectedGoal)
            });
            setError('Connection issue - using offline responses');
        } finally {
            setIsTyping(false);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setDocumentFile(file);
            addMessage({
                type: 'user',
                content: `📄 Uploaded document: ${file.name}`
            });

            setIsTyping(true);

            try {
                // Process the document using the document processing service
                const result = await documentProcessingService.processDocument(file, selectedGoal);

                if (result.success) {
                    const summary = documentProcessingService.generateProcessingSummary(result);

                    addMessage({
                        type: 'ai',
                        content: summary
                    });

                    // If data was extracted successfully, offer to add it to their profile
                    if (result.extractedData && Object.keys(result.extractedData).some(key =>
                        Array.isArray(result.extractedData[key]) ? result.extractedData[key].length > 0 : result.extractedData[key]
                    )) {
                        setTimeout(() => {
                            addMessage({
                                type: 'ai',
                                content: `Would you like me to add this extracted financial information to your profile? This will help me provide more accurate advice tailored to your ${selectedGoal ? goalOptions.find(g => g.id === selectedGoal)?.label.toLowerCase() : 'financial planning'} goals.`
                            });
                        }, 1000);
                    }
                } else {
                    addMessage({
                        type: 'ai',
                        content: `I had trouble processing ${file.name}: ${result.error}\n\nCould you manually share the key financial information from this document? For example, income amounts, expenses, account balances, or loan details.`
                    });
                }
            } catch (error) {
                console.error('Document processing error:', error);
                addMessage({
                    type: 'ai',
                    content: `I encountered an issue processing your document. Could you manually share the key financial figures from ${file.name}? I can help analyze income, expenses, savings, investments, or debt information.`
                });
            } finally {
                setIsTyping(false);
            }
        }
    };

    return (
        <div className="card flex flex-col h-full">
            {/* Enhanced Chat Header with Goal Context */}
            <div className="flex items-center justify-between pb-5 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="avatar avatar-ai">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            UK Financial Planning Assistant
                        </h3>
                        <p className="text-sm text-gray-500">
                            {isTyping ? 'Typing...' : selectedGoal ?
                                `Focused on: ${goalOptions.find(g => g.id === selectedGoal)?.label}` :
                                'AI-powered financial guidance'
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {selectedGoal && (
                        <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                            <Target className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                                {goalOptions.find(g => g.id === selectedGoal)?.icon}
                            </span>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center space-x-2 text-sm text-amber-600">
                            <AlertCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Offline mode</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages Container */}
            <div className="messages-container">
                <div>
                    {messages.map((message, idx) => (
                        <div
                            key={message.id || idx}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                }`}>
                                <div className={`avatar ${message.type === 'user' ? 'avatar-user' : 'avatar-ai'}`}>
                                    {message.type === 'user' ? (
                                        <User className="w-4 h-4 text-white" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-white" />
                                    )}
                                </div>
                                <div className={`${message.type === 'user' ? 'user-message' : 'ai-message'}`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Goal Selection Buttons */}
                    {showGoalSelection && (
                        <div className="flex justify-start mb-4">
                            <div className="ai-message max-w-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                    {goalOptions.map((goal) => (
                                        <button
                                            key={goal.id}
                                            onClick={() => handleGoalSelection(goal.id)}
                                            className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-2xl">{goal.icon}</span>
                                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-800">
                                                    {goal.label}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-gray-600 group-hover:text-blue-700">
                                                {goal.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form vs Conversation Choice */}
                    {showFormOption && (
                        <div className="flex justify-start mb-4">
                            <div className="ai-message">
                                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                    <button
                                        onClick={() => handleFormChoice(false)}
                                        className="flex-1 p-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold"
                                    >
                                        💬 Continue Conversation
                                    </button>
                                    <button
                                        onClick={() => handleFormChoice(true)}
                                        className="flex-1 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold"
                                    >
                                        📋 Fill Out Form
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-start space-x-3">
                                <div className="avatar avatar-ai">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="ai-message">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Enhanced Input Area */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200 flex-shrink-0">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedGoal ?
                        `Ask about ${goalOptions.find(g => g.id === selectedGoal)?.label.toLowerCase()}...` :
                        "Type your message..."
                    }
                    className="input-standard flex-1"
                    disabled={isTyping}
                    maxLength={500}
                />

                {/* Document Upload Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary p-3"
                    title="Upload financial document"
                    disabled={isTyping}
                >
                    <FileUp className="w-4 h-4" />
                </button>

                <button
                    onClick={handleSend}
                    disabled={!inputMessage.trim() || isTyping}
                    className="btn-primary"
                    title="Send message"
                >
                    <Send className="w-4 h-4" />
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </div>

            {/* Error display */}
            {error && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg flex-shrink-0">
                    <p className="text-xs text-amber-800">{error}</p>
                </div>
            )}

            {/* Goal Change Option */}
            {selectedGoal && !showGoalSelection && (
                <div className="mt-2 text-center flex-shrink-0">
                    <button
                        onClick={() => {
                            setSelectedGoal(null);
                            setShowGoalSelection(true);
                            addMessage({
                                type: 'ai',
                                content: 'No problem! What other financial goal would you like to focus on?'
                            });
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Change financial goal
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;