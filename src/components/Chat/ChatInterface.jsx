import './ChatInterface.css';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import openAIService from '../../services/openai';

const ChatInterface = () => {
    const { messages, addMessage } = useApp();
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Add initial message if none exist
    useEffect(() => {
        if (messages.length === 0) {
            addMessage({
                type: 'ai',
                content: 'Hello! I\'m your financial planning assistant. I\'m here to help you understand your financial situation and goals. What would you like to discuss today?'
            });
        }
    }, [messages.length, addMessage]);

    const handleSend = async () => {
        if (!inputMessage.trim() || isTyping) return;

        // Clear any previous errors
        setError(null);

        // Get user message and clear input immediately
        const userMessage = inputMessage.trim();
        setInputMessage('');
        setIsTyping(true);

        // Add user message to chat
        addMessage({
            type: 'user',
            content: userMessage
        });

        try {
            // Check if openAI service exists and has sendMessage method
            if (openAIService && typeof openAIService.sendMessage === 'function') {
                const result = await openAIService.sendMessage(userMessage, messages);

                if (result && result.success) {
                    addMessage({
                        type: 'ai',
                        content: result.message
                    });
                } else {
                    // Fallback response
                    addMessage({
                        type: 'ai',
                        content: generateFallbackResponse(userMessage)
                    });
                    if (result && result.message) {
                        setError('Using fallback response - API issue');
                    }
                }
            } else {
                // OpenAI service not available, use fallback
                addMessage({
                    type: 'ai',
                    content: generateFallbackResponse(userMessage)
                });
                setError('AI service unavailable - using basic responses');
            }
        } catch (error) {
            console.error('Chat error:', error);
            addMessage({
                type: 'ai',
                content: generateFallbackResponse(userMessage)
            });
            setError('Connection issue - using fallback response');
        } finally {
            setIsTyping(false);
            // Focus back on input after a short delay
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    };

    // Generate intelligent fallback responses based on user input
    // Enhanced fallback response function for ChatInterface.jsx

    const generateFallbackResponse = (input) => {
        const lowerInput = input.toLowerCase();

        // Income-related responses with categorization guidance
        if (lowerInput.includes('income') || lowerInput.includes('salary') || lowerInput.includes('earn')) {
            if (lowerInput.includes('job') || lowerInput.includes('work') || lowerInput.includes('employment')) {
                return "Great! I can see you're sharing employment income information. To give you better financial planning advice, could you also tell me about any other income sources you might have? For example: self-employment income, pension income, investment returns, or benefits?";
            }

            if (lowerInput.includes('business') || lowerInput.includes('freelance') || lowerInput.includes('self-employed')) {
                return "Excellent - self-employment income is important for your financial plan. Do you also have employment income from a regular job, or is this your primary income source? Also, what are your main business expenses?";
            }

            if (lowerInput.includes('pension') || lowerInput.includes('retirement')) {
                return "Pension income is a crucial part of retirement planning. Are you currently receiving this pension, or is this a projected amount? Do you have other income sources like employment or investments?";
            }

            if (lowerInput.includes('investment') || lowerInput.includes('dividend') || lowerInput.includes('rental')) {
                return "Investment income shows good financial planning! Could you tell me about your other income sources, such as employment income or pension? This helps me understand your complete financial picture.";
            }

            // General income response
            return "Thank you for sharing your income information. To provide more personalized advice, could you specify what type of income this is? For example:\n• Employment income from your job\n• Self-employment/business income\n• Pension or retirement income\n• Investment income (dividends, rental)\n• Benefits or other sources\n\nAlso, what are your main monthly expenses?";
        }

        // Expense-related responses with categorization guidance
        if (lowerInput.includes('expense') || lowerInput.includes('spend') || lowerInput.includes('cost')) {
            if (lowerInput.includes('rent') || lowerInput.includes('mortgage') || lowerInput.includes('housing')) {
                return "Housing costs are typically the largest expense. I've noted your housing expenses. Could you also share your other main expense categories? For example: transportation, food & groceries, utilities, insurance, and entertainment spending?";
            }

            if (lowerInput.includes('car') || lowerInput.includes('transport') || lowerInput.includes('travel')) {
                return "Transportation costs are important to track. Besides transport, what do you spend on other categories like housing (rent/mortgage), food & groceries, utilities, insurance, and entertainment?";
            }

            if (lowerInput.includes('food') || lowerInput.includes('groceries') || lowerInput.includes('shopping')) {
                return "Food and grocery expenses are a key budget category. Could you also share your spending on housing, transportation, utilities, insurance, and entertainment? This helps me see your complete spending pattern.";
            }

            if (lowerInput.includes('total') || lowerInput.includes('overall') || lowerInput.includes('month')) {
                return "I see you've mentioned your total monthly expenses. While this gives me a good overview, it would be helpful to understand the breakdown. Could you share how much you spend on different categories like:\n• Housing (rent/mortgage)\n• Transportation\n• Food & groceries\n• Utilities\n• Insurance\n• Entertainment\n\nThis breakdown helps me provide better budgeting advice.";
            }

            // General expense response
            return "Thanks for sharing your expense information. For better financial planning, could you break down your spending into categories? The main ones are:\n• Housing (rent/mortgage)\n• Transportation\n• Food & groceries\n• Utilities\n• Insurance\n• Entertainment\n\nIf you prefer, you can just tell me your total monthly expenses and I'll note that a detailed breakdown isn't available yet.";
        }

        // Goal-related responses
        if (lowerInput.includes('goal') || lowerInput.includes('save') || lowerInput.includes('plan')) {
            if (lowerInput.includes('house') || lowerInput.includes('home') || lowerInput.includes('property')) {
                return "Buying a home is an excellent financial goal! To help you create a realistic savings plan, I'd need to understand:\n• Your target timeframe for buying\n• Your target price range or deposit amount\n• Your current income and expenses\n• Any existing savings towards this goal\n\nWhat's your ideal timeline for purchasing?";
            }

            if (lowerInput.includes('retire') || lowerInput.includes('retirement')) {
                return "Retirement planning is crucial and it's great you're thinking about it! To provide specific advice, could you share:\n• Your target retirement age\n• Your expected annual expenses in retirement\n• Current pension contributions\n• Other retirement savings\n\nWhat age are you hoping to retire?";
            }

            return "Your financial goals are the foundation of a good plan. Could you be more specific about what you're trying to achieve? For example:\n• Buying a house (when and how much?)\n• Retirement planning (what age?)\n• Emergency fund (how many months of expenses?)\n• Education funding\n• Starting a business\n\nWhat's your most important financial goal right now?";
        }

        // Risk tolerance responses
        if (lowerInput.includes('risk') || lowerInput.includes('investment') || lowerInput.includes('conservative') || lowerInput.includes('aggressive')) {
            return "Understanding your risk tolerance is essential for investment advice. Based on what you've shared, I can help recommend suitable investment approaches. Could you also tell me:\n• Your investment timeline (short-term vs long-term)\n• Your current income and expenses\n• Your main financial goals\n• Any existing investments\n\nThis helps me provide more tailored investment guidance.";
        }

        // Greeting responses
        if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
            return "Hello! I'm here to help with your financial planning. To get started, you can share information about:\n\n💰 **Income**: Tell me about your salary, business income, pensions, or other income sources\n\n💸 **Expenses**: Share your monthly spending on housing, transport, food, utilities, etc.\n\n🎯 **Goals**: What are you saving for? House, retirement, emergency fund?\n\n📊 **Risk**: Are you conservative, moderate, or aggressive with investments?\n\nWhat would you like to discuss first?";
        }

        // Thank you responses
        if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
            return "You're welcome! I'm here to help you build a comprehensive financial plan. Is there anything else you'd like to share about your income sources, expense categories, financial goals, or investment preferences?";
        }

        // Clarification requests
        if (lowerInput.includes('what') && (lowerInput.includes('mean') || lowerInput.includes('need'))) {
            return "I'm looking to understand your complete financial picture to provide personalized advice. Here's what helps me most:\n\n**Income Sources**: Employment salary, self-employment earnings, pensions, investments, benefits\n\n**Expense Categories**: Housing, transportation, food, utilities, insurance, entertainment\n\n**Financial Goals**: House purchase, retirement age, emergency fund, education funding\n\n**Risk Tolerance**: Conservative (low risk), moderate (balanced), or aggressive (high risk) for investments\n\nYou can share any of these in your own words - I'll understand and categorize them automatically!";
        }

        // Numbers without context
        if (/\d+k?\b/.test(lowerInput) && !lowerInput.includes('age') && !lowerInput.includes('year')) {
            return "I can see you've mentioned some figures - that's helpful! Could you provide a bit more context? For example:\n• Is this income? (\"I earn £50k from my job\")\n• Is this an expense? (\"My rent is £1200 per month\")\n• Is this a savings goal? (\"I want to save £20k for a house deposit\")\n\nThe more context you provide, the better I can categorize and analyze your financial information.";
        }

        // Default response
        return "I'm here to help you build a comprehensive financial plan. You can share information about:\n\n• **Income**: Your salary, business earnings, pensions, or other income sources\n• **Expenses**: Monthly spending on housing, transport, food, utilities, etc.\n• **Goals**: What you're saving for (house, retirement, emergency fund)\n• **Risk tolerance**: Your comfort level with investment risk\n\nJust tell me about any aspect of your finances in your own words - for example: \"I earn £45k from my job and spend about £2k per month on expenses\" or \"I want to buy a house in 3 years.\"\n\nWhat would you like to start with?";
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="card flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-5 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="avatar avatar-ai">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Financial Planning Assistant</h3>
                        <p className="text-sm text-gray-500">
                            {isTyping ? 'Typing...' : 'AI-powered financial guidance'}
                        </p>
                    </div>
                </div>
                {error && (
                    <div className="flex items-center space-x-2 text-sm text-amber-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Offline mode</span>
                    </div>
                )}
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
                                    <p className="text-sm leading-relaxed">
                                        {typeof message.content === 'object'
                                            ? JSON.stringify(message.content, null, 2)
                                            : message.content
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

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

            {/* Input Area */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200 flex-shrink-0">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="input-standard flex-1"
                    disabled={isTyping}
                    maxLength={500}
                />
                <button
                    onClick={handleSend}
                    disabled={!inputMessage.trim() || isTyping}
                    className="btn-primary"
                    title="Send message"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>

            {/* Error display */}
            {error && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg flex-shrink-0">
                    <p className="text-xs text-amber-800">{error}</p>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
