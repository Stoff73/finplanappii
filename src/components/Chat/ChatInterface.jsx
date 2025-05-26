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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        if (!inputMessage.trim()) return;

        // Clear any previous errors
        setError(null);

        // Add user message
        const userMessage = inputMessage.trim();
        addMessage({
            type: 'user',
            content: userMessage
        });

        setInputMessage('');
        setIsTyping(true);

        try {
            // Get AI response
            const result = await openAIService.sendMessage(userMessage, messages);

            if (result.success) {
                addMessage({
                    type: 'ai',
                    content: result.message
                });
            } else {
                addMessage({
                    type: 'ai',
                    content: result.message
                });
                setError('Connection issue - using fallback response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            addMessage({
                type: 'ai',
                content: 'I\'m experiencing technical difficulties. Please try again in a moment.'
            });
            setError('Failed to get response');
        } finally {
            setIsTyping(false);
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="card flex flex-col" style={{ height: '600px' }}>
            {/* Chat Header */}
            <div className="flex items-center space-x-3 pb-5 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Financial Planning Assistant</h3>
                    <p className="text-sm text-gray-500">
                        {isTyping ? 'Typing...' : 'AI-powered financial guidance'}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-5 space-y-3">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                            }`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${message.type === 'user' ? 'bg-blue-800' : 'bg-gray-500'
                                }`}>
                                {message.type === 'user' ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Bot className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div className={`px-4 py-3 rounded-xl ${message.type === 'user'
                                    ? 'bg-blue-800 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}>
                                <p className="text-sm">{message.content}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-gray-500 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="px-4 py-3 rounded-xl bg-gray-100">
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

            {/* Input */}
            <div className="flex space-x-3 pt-5 border-t border-gray-200">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="input-standard flex-1"
                    disabled={isTyping}
                />
                <button
                    onClick={handleSend}
                    disabled={!inputMessage.trim() || isTyping}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ minWidth: '52px' }}
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
