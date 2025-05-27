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
    const generateFallbackResponse = (input) => {
        const lowerInput = input.toLowerCase();

        // Financial keywords and responses
        if (lowerInput.includes('income') || lowerInput.includes('salary') || lowerInput.includes('earn')) {
            return "I understand you're sharing information about your income. This is important for creating a comprehensive financial plan. Could you tell me more about your monthly expenses as well?";
        }

        if (lowerInput.includes('expense') || lowerInput.includes('spend') || lowerInput.includes('cost')) {
            return "Thank you for sharing your expense information. Understanding your spending patterns helps me provide better financial guidance. What are your main financial goals?";
        }

        if (lowerInput.includes('goal') || lowerInput.includes('save') || lowerInput.includes('plan')) {
            return "Your financial goals are crucial for creating a personalized plan. Could you share more details about the timeline and amounts involved? This helps me provide more specific advice.";
        }

        if (lowerInput.includes('risk') || lowerInput.includes('investment') || lowerInput.includes('conservative') || lowerInput.includes('aggressive')) {
            return "Understanding your risk tolerance is essential for investment recommendations. Based on what you've shared, I can help you explore suitable investment options that match your comfort level.";
        }

        if (lowerInput.includes('house') || lowerInput.includes('home') || lowerInput.includes('property')) {
            return "Buying a home is a significant financial goal. I'd need to understand your current financial situation, including income, savings, and debt, to help you create a realistic home-buying plan.";
        }

        if (lowerInput.includes('retire') || lowerInput.includes('pension')) {
            return "Retirement planning is crucial and it's great that you're thinking about it. Your retirement needs will depend on your desired lifestyle, current age, and savings rate. What's your target retirement age?";
        }

        if (lowerInput.includes('debt') || lowerInput.includes('loan') || lowerInput.includes('credit')) {
            return "Managing debt is an important part of financial health. I can help you understand different debt repayment strategies. Could you share more about the types and amounts of debt you have?";
        }

        // Greeting responses
        if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
            return "Hello! I'm here to help with your financial planning. You can share information about your income, expenses, financial goals, or ask questions about budgeting, saving, or investing.";
        }

        // Thank you responses
        if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
            return "You're welcome! I'm here to help you with your financial planning journey. Is there anything specific about your finances you'd like to discuss or analyze?";
        }

        // Default response
        return "I'm analyzing the information you've shared. Could you provide more details about your financial situation? For example, your income, monthly expenses, financial goals, or risk tolerance for investments. The more you share, the better I can assist you with personalized financial guidance.";
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
