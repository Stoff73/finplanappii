class OpenAIService {
    constructor() {
        this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    }

    async sendMessage(message, conversationHistory = []) {
        if (!this.apiKey) {
            return {
                success: false,
                message: this.getFallbackResponse(message),
                error: 'No API key'
            };
        }

        try {
            const messages = [
                {
                    role: 'system',
                    content: 'You are a helpful UK financial planning assistant. Keep responses conversational and helpful. Ask one question at a time to understand the user\'s financial situation. Be encouraging and ask follow-up questions about their goals, income, expenses, and risk tolerance.'
                },
                ...conversationHistory.slice(-6).map(msg => ({
                    role: msg.type === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
                {
                    role: 'user',
                    content: message
                }
            ];

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4.1-mini',
                    messages: messages,
                    max_tokens: 200,
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            return {
                success: true,
                message: data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.',
            };
        } catch (error) {
            console.error('OpenAI API error:', error);
            return {
                success: false,
                message: 'I\'m having trouble connecting right now. Could you try again? In the meantime, ' + this.getFallbackResponse(message),
                error: error.message
            };
        }
    }

    isConfigured() {
        return !!this.apiKey;
    }

    getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('income') || lowerMessage.includes('salary') || lowerMessage.includes('earn')) {
            return "That's great that you're thinking about your income! Understanding your monthly income is crucial for financial planning. Could you tell me about your main sources of income and any irregular income you might have?";
        }

        if (lowerMessage.includes('expenses') || lowerMessage.includes('spend') || lowerMessage.includes('cost')) {
            return "Expenses are a key part of financial planning! It's important to understand where your money goes each month. Could you break down your main expenses like housing, food, transport, and any other significant costs?";
        }

        if (lowerMessage.includes('goal') || lowerMessage.includes('plan') || lowerMessage.includes('future')) {
            return "Financial goals are so important! Whether it's saving for a house, planning for retirement, or building an emergency fund - having clear goals helps guide your financial decisions. What are your main financial priorities right now?";
        }

        if (lowerMessage.includes('invest') || lowerMessage.includes('save') || lowerMessage.includes('money')) {
            return "Investing and saving are great topics! Your approach should depend on your goals, timeline, and risk tolerance. Could you tell me more about what you're hoping to achieve and your timeframe?";
        }

        const fallbacks = [
            "That's a great point! To give you the most relevant guidance, could you tell me more about your current financial situation - your income, main expenses, and what you're hoping to achieve?",
            "I'd love to help you with that! Could you share more details about your financial goals and what's most important to you right now?",
            "Financial planning is so personal to each situation. Could you tell me about your current income, expenses, and what financial goals you're working towards?",
            "That's an interesting question! To give you the best advice, could you help me understand your financial priorities and current situation better?",
        ];

        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}

export default new OpenAIService();
  
  