import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ChatInterface = () => {
    const { messages, addMessage } = useApp();
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Add initial message ONLY if no messages exist AND we haven't initialized yet
    useEffect(() => {
        if (!hasInitialized) {
            setHasInitialized(true);

            // Only add initial message if there are truly no messages
            if (messages.length === 0) {
                addMessage({
                    type: 'ai',
                    content: 'Hello! I\'m your financial planning assistant. How can I help you today?'
                });
            }
        }
    }, [hasInitialized, messages.length, addMessage]);

    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        // Add user message
        addMessage({
            type: 'user',
            content: inputMessage.trim()
        });

        setInputMessage('');
        setIsTyping(true);

        // Simulate AI response (replace with real API later)
        setTimeout(() => {
            addMessage({
                type: 'ai',
                content: 'Thanks for your message! This is a simulated response. Real AI integration will come later.'
            });
            setIsTyping(false);
        }, 1500);
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
