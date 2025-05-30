// src/services/openai.js
class OpenAIService {
    constructor() {
        // Use environment variables for API configuration
        this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-4';
        this.isAvailable = !!this.apiKey;

        // UK Financial Planning Context (2025/26 Tax Year)
        this.ukFinancialContext = {
            taxYear: '2025/26',
            personalAllowance: 12570,
            basicRateThreshold: 50270,
            higherRateThreshold: 125140,
            basicTaxRate: 0.20,
            higherTaxRate: 0.40,
            additionalTaxRate: 0.45,
            niThresholds: {
                primary: 12570,
                upper: 50270,
                rate1: 0.12,
                rate2: 0.02
            },
            pensionContributions: {
                annualAllowance: 60000,
                lifetimeAllowance: 1073100
            },
            savingsRates: {
                baseRate: 4.75,
                premiumBondsMax: 50000,
                isaLimit: 20000
            },
            regulations: {
                mortgageStressTest: 0.06,
                retirementAge: 67,
                statePension: 11502 // 2025/26 estimate
            }
        };

        // Goal-specific prompt templates
        this.goalPrompts = {
            retirement: this.createRetirementPrompt(),
            house: this.createHousePrompt(),
            emergency: this.createEmergencyPrompt(),
            investment: this.createInvestmentPrompt(),
            debt: this.createDebtPrompt(),
            education: this.createEducationPrompt(),
            general: this.createGeneralPrompt()
        };

        // Database schema information for AI context
        this.databaseSchema = {
            income: ['amount', 'frequency', 'source', 'category'],
            expenses: ['amount', 'frequency', 'category', 'type'],
            goals: ['type', 'targetAmount', 'timeframe', 'priority'],
            assets: ['type', 'value', 'growth', 'liquidity'],
            debts: ['type', 'balance', 'rate', 'minimumPayment'],
            riskProfile: ['level', 'timeHorizon', 'capacity', 'tolerance']
        };
    }

    createRetirementPrompt() {
        return `You are a UK financial planning specialist focusing on retirement planning for the ${this.ukFinancialContext.taxYear} tax year.

Key UK Retirement Context:
- State Pension Age: ${this.ukFinancialContext.regulations.retirementAge}
- Full State Pension: £${this.ukFinancialContext.regulations.statePension.toLocaleString()} annually
- Annual Allowance: £${this.ukFinancialContext.pensionContributions.annualAllowance.toLocaleString()}
- Lifetime Allowance: £${this.ukFinancialContext.pensionContributions.lifetimeAllowance.toLocaleString()}

Essential Information to Gather:
1. Current age and target retirement age
2. Existing pension savings (workplace & personal)
3. Current pension contributions and employer matching
4. Expected retirement income needs
5. Other retirement assets (ISAs, investments, property)
6. State pension entitlement

Key Questions to Ask:
- "What age are you hoping to retire?"
- "How much do you currently contribute to your pension?"
- "Does your employer match pension contributions?"
- "What do you expect your annual expenses to be in retirement?"
- "Do you have any other retirement savings outside your pension?"

Use UK pension terminology and regulations. Consider auto-enrolment, salary sacrifice, and tax relief implications.`;
    }

    createHousePrompt() {
        return `You are a UK mortgage and property specialist for the ${this.ukFinancialContext.taxYear} tax year.

Key UK Property Context:
- Mortgage stress test rate: ${(this.ukFinancialContext.regulations.mortgageStressTest * 100)}%
- Help to Buy ISA and Lifetime ISA available
- Stamp duty considerations for first-time buyers
- Typical deposit requirements: 5-20%

Essential Information to Gather:
1. Target property price or area
2. Current savings for deposit
3. Annual income for affordability calculations
4. Existing debts and credit commitments
5. First-time buyer status
6. Timeline for purchase

Key Questions to Ask:
- "What's your target budget for buying a property?"
- "How much have you saved for a deposit so far?"
- "Are you a first-time buyer?"
- "What's your household annual income?"
- "When are you hoping to buy?"
- "Do you have a Help to Buy ISA or Lifetime ISA?"

Focus on UK mortgage criteria, affordability rules, and government schemes for first-time buyers.`;
    }

    createEmergencyPrompt() {
        return `You are helping create an emergency fund strategy using UK-appropriate savings products.

UK Emergency Fund Context:
- Bank of England base rate: ${this.ukFinancialContext.savingsRates.baseRate}%
- Easy access savings accounts available
- Cash ISA allowance: £${this.ukFinancialContext.savingsRates.isaLimit.toLocaleString()}
- Premium Bonds up to £${this.ukFinancialContext.savingsRates.premiumBondsMax.toLocaleString()}

Essential Information to Gather:
1. Monthly essential expenses
2. Job security and income stability
3. Existing emergency savings
4. Preferred savings timeline
5. Access requirements (instant vs notice accounts)

Key Questions to Ask:
- "What are your essential monthly expenses?"
- "How secure is your employment?"
- "Do you have any emergency savings currently?"
- "Would you need instant access to emergency funds?"
- "Are you comfortable with 3-6 months of expenses as a target?"

Recommend UK-specific savings products and consider tax-efficient options like Cash ISAs.`;
    }

    createInvestmentPrompt() {
        return `You are a UK investment specialist focusing on tax-efficient investing for the ${this.ukFinancialContext.taxYear} tax year.

UK Investment Context:
- ISA allowance: £${this.ukFinancialContext.savingsRates.isaLimit.toLocaleString()} (Stocks & Shares ISA)
- Capital Gains Tax allowance: £3,000 (estimated for 2025/26)
- Dividend allowance: £500
- SIPP available for additional pension saving

Essential Information to Gather:
1. Investment timeline and goals
2. Risk tolerance and capacity
3. Existing investments and ISA usage
4. Knowledge and experience level
5. Tax situation and efficiency needs
6. Regular vs lump sum investing preference

Key Questions to Ask:
- "What's your investment timeline?"
- "How would you describe your risk tolerance?"
- "Do you currently use your ISA allowance?"
- "Are you investing regularly or as a lump sum?"
- "What's your experience with investing?"
- "Are you a basic or higher rate taxpayer?"

Focus on tax-efficient wrappers, diversification, and appropriate UK investment platforms.`;
    }

    createDebtPrompt() {
        return `You are helping with UK debt management and repayment strategies.

UK Debt Context:
- Typical credit card rates: 15-25% APR
- Personal loan rates: 3-15% APR depending on amount and credit score
- Mortgage rates: Variable based on Bank of England base rate
- Student loan rates: RPI + margin depending on plan type

Essential Information to Gather:
1. Types and amounts of debt
2. Interest rates and minimum payments
3. Income available for debt repayment
4. Credit score and history
5. Secured vs unsecured debts
6. Payment priorities

Key Questions to Ask:
- "What types of debt do you currently have?"
- "What are the interest rates on each debt?"
- "How much can you afford for debt repayment monthly?"
- "Do you have any secured debts like a mortgage?"
- "What are the minimum payments required?"

Focus on avalanche vs snowball methods, debt consolidation options, and UK-specific debt advice.`;
    }

    createEducationPrompt() {
        return `You are helping with UK education funding planning.

UK Education Context:
- University tuition fees: Up to £9,250 per year (England)
- Student loan system with income-contingent repayment
- Junior ISAs available for long-term education savings
- Child benefit available until age 18 (or 20 in education)

Essential Information to Gather:
1. Child's age and education timeline
2. Type of education being planned for
3. Expected costs and duration
4. Current education savings
5. Other children to consider
6. Tax-efficient saving preferences

Key Questions to Ask:
- "How old is your child?"
- "Are you saving for university or other education?"
- "Do you have a Junior ISA set up?"
- "What level of financial support do you want to provide?"
- "Do you have other children to consider?"

Focus on tax-efficient education savings and realistic cost planning for UK education.`;
    }

    createGeneralPrompt() {
        return `You are a comprehensive UK financial planning assistant for the ${this.ukFinancialContext.taxYear} tax year.

UK Financial Planning Context:
- Personal Allowance: £${this.ukFinancialContext.personalAllowance.toLocaleString()}
- Basic rate tax: ${(this.ukFinancialContext.basicTaxRate * 100)}% up to £${this.ukFinancialContext.basicRateThreshold.toLocaleString()}
- Higher rate tax: ${(this.ukFinancialContext.higherTaxRate * 100)}% up to £${this.ukFinancialContext.higherRateThreshold.toLocaleString()}
- National Insurance: ${(this.ukFinancialContext.niThresholds.rate1 * 100)}% on earnings £${this.ukFinancialContext.niThresholds.primary.toLocaleString()}-£${this.ukFinancialContext.niThresholds.upper.toLocaleString()}

Essential Information Areas:
1. Income sources and tax position
2. Monthly expenses and budgeting
3. Financial goals and priorities
4. Risk tolerance and investment experience
5. Existing savings and investments
6. Protection needs (life insurance, etc.)

Key Questions for Comprehensive Planning:
- "What's your employment situation and annual income?"
- "What are your main monthly expenses?"
- "What are your key financial goals?"
- "How would you describe your approach to risk?"
- "Do you have adequate emergency savings?"
- "What existing savings and investments do you have?"

Provide holistic UK financial planning advice considering tax efficiency, regulatory requirements, and best practices.`;
    }

    async sendMessage(userMessage, messageHistory = [], selectedGoal = null) {
        if (!this.isAvailable) {
            console.log('OpenAI API not available, using fallback');
            return {
                success: false,
                message: this.generateEnhancedFallback(userMessage, selectedGoal),
                isOffline: true
            };
        }

        try {
            const systemPrompt = this.buildSystemPrompt(selectedGoal, messageHistory);
            const conversationContext = this.buildConversationContext(messageHistory);

            const messages = [
                { role: 'system', content: systemPrompt },
                ...conversationContext,
                { role: 'user', content: userMessage }
            ];

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7,
                    presence_penalty: 0.1,
                    frequency_penalty: 0.1
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            const aiMessage = data.choices[0]?.message?.content;

            if (!aiMessage) {
                throw new Error('No response from OpenAI');
            }

            return {
                success: true,
                message: aiMessage,
                isOffline: false,
                usage: data.usage
            };

        } catch (error) {
            console.error('OpenAI service error:', error);
            return {
                success: false,
                message: this.generateEnhancedFallback(userMessage, selectedGoal),
                isOffline: true,
                error: error.message
            };
        }
    }

    buildSystemPrompt(selectedGoal, messageHistory) {
        const goalType = selectedGoal || this.detectGoalFromHistory(messageHistory) || 'general';
        const basePrompt = this.goalPrompts[goalType] || this.goalPrompts.general;

        const databaseInfo = `
Database Schema Context:
You're helping populate a financial database with these structures:
${Object.entries(this.databaseSchema).map(([table, fields]) =>
            `- ${table}: ${fields.join(', ')}`
        ).join('\n')}

When users provide financial information, structure your responses to naturally guide them toward providing data that fits these categories.`;

        const behaviorGuidelines = `
Response Guidelines:
1. Ask ONE focused question at a time
2. Use UK financial terminology and examples
3. Provide context for why information is needed
4. Offer specific examples when helpful (e.g., "like £50,000 annual salary or £4,000 monthly")
5. Acknowledge information provided before asking for more
6. Consider UK tax implications in your advice
7. Be encouraging and supportive throughout the process
8. Reference current UK financial regulations when relevant

Conversation Style:
- Professional but approachable
- Use "you" to keep it personal
- Explain financial concepts clearly
- Provide realistic UK examples
- Show how their information builds toward their goals`;

        return `${basePrompt}

${databaseInfo}

${behaviorGuidelines}`;
    }

    buildConversationContext(messageHistory) {
        // Include recent conversation context (last 10 messages)
        const recentMessages = messageHistory.slice(-10);

        return recentMessages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));
    }

    detectGoalFromHistory(messageHistory) {
        const conversationText = messageHistory
            .filter(msg => msg.type === 'user')
            .map(msg => msg.content)
            .join(' ')
            .toLowerCase();

        // Goal detection patterns
        const goalPatterns = {
            retirement: /retire|retirement|pension|retire at|retiring/,
            house: /house|home|property|buy.*house|mortgage|deposit/,
            emergency: /emergency|emergency fund|rainy day|financial security/,
            investment: /invest|investment|portfolio|stocks|shares|isa/,
            debt: /debt|pay.*off|credit card|loan|owe/,
            education: /education|university|school|child.*education|save.*education/
        };

        for (const [goal, pattern] of Object.entries(goalPatterns)) {
            if (pattern.test(conversationText)) {
                return goal;
            }
        }

        return 'general';
    }

    generateEnhancedFallback(userMessage, selectedGoal = null) {
        const goalType = selectedGoal || 'general';
        const lowerInput = userMessage.toLowerCase();

        // Goal-specific fallback responses
        if (goalType === 'retirement') {
            return this.generateRetirementFallback(lowerInput);
        } else if (goalType === 'house') {
            return this.generateHouseFallback(lowerInput);
        } else if (goalType === 'emergency') {
            return this.generateEmergencyFallback(lowerInput);
        } else if (goalType === 'investment') {
            return this.generateInvestmentFallback(lowerInput);
        } else if (goalType === 'debt') {
            return this.generateDebtFallback(lowerInput);
        } else if (goalType === 'education') {
            return this.generateEducationFallback(lowerInput);
        }

        // Enhanced general fallback with UK context
        return this.generateGeneralFallback(lowerInput);
    }

    generateRetirementFallback(input) {
        if (/income|salary|earn/.test(input)) {
            return `Great! Understanding your income is crucial for retirement planning. In the UK, both you and your employer can contribute to your pension with tax relief. 

Could you also tell me:
- Do you have a workplace pension with employer contributions?
- What age are you hoping to retire?
- Do you know your current pension pot value?

This helps me calculate how much you might need to save to meet your retirement goals.`;
        }

        if (/age|retire/.test(input)) {
            return `Excellent - knowing your target retirement age helps with the planning timeline. The State Pension age is currently ${this.ukFinancialContext.regulations.retirementAge}, but you can retire earlier with sufficient private pension savings.

To create your retirement plan, I'd also like to know:
- Your current annual income
- How much you're currently contributing to pensions
- What lifestyle you're hoping for in retirement

What's your current employment and income situation?`;
        }

        if (/pension|contribute/.test(input)) {
            return `That's helpful pension information! In the UK, you can get tax relief on pension contributions up to £${this.ukFinancialContext.pensionContributions.annualAllowance.toLocaleString()} annually.

To optimize your retirement planning:
- Could you tell me your age and target retirement age?
- What's your current annual income?
- Do you have any existing pension savings?

This will help me work out if you're on track for your retirement goals.`;
        }

        return `I'm here to help with your retirement planning using UK pension rules and tax benefits. To create a personalized retirement strategy, I need to understand:

**Key Information:**
- Your current age and target retirement age
- Annual income and current pension contributions
- Existing pension pot values
- Expected retirement lifestyle costs

What would you like to start with? For example, you could say "I'm 35 and want to retire at 60" or "I earn £45,000 and contribute 5% to my pension."`;
    }

    generateHouseFallback(input) {
        if (/income|salary|earn/.test(input)) {
            return `Income is a key factor for mortgage affordability in the UK. Most lenders will offer 4-4.5 times your annual income, though this depends on your outgoings and credit score.

For house buying planning, I'd also like to know:
- What's your target property price or area?
- How much deposit have you saved so far?
- Are you a first-time buyer?
- Do you have a Help to Buy ISA or Lifetime ISA?

These details help me calculate what you can afford and suggest the best savings strategy.`;
        }

        if (/deposit|save|saving/.test(input)) {
            return `Great work on building your deposit! In the UK, you typically need 5-20% deposit depending on the lender and your circumstances.

To help with your house buying strategy:
- What's your target property price?
- What's your annual household income?
- Are you a first-time buyer (eligible for government schemes)?
- When are you hoping to buy?

If you're a first-time buyer, you might benefit from a Lifetime ISA with 25% government bonus on contributions up to £4,000 annually.`;
        }

        if (/price|property|house/.test(input)) {
            return `Understanding your target property price helps with planning your deposit and mortgage affordability. UK house prices vary significantly by region.

To create your house buying plan:
- What's your household annual income?
- How much deposit have you saved so far?
- Are you a first-time buyer?
- What timeline are you working toward?

Most UK lenders use a 4-4.5x income multiple, so I can help work out what's realistic for your situation.`;
        }

        return `I'm here to help with your house buying journey using current UK mortgage rules and first-time buyer schemes. To create your property purchase plan, I need to understand:

**Key Information:**
- Your target property price or area
- Household annual income
- Current deposit savings
- First-time buyer status
- Timeline for purchase

What would you like to start with? For example: "I want to buy a £300,000 house" or "I earn £50,000 and have saved £25,000 for a deposit."`;
    }

    generateEmergencyFallback(input) {
        if (/expense|spend|cost/.test(input)) {
            return `Understanding your monthly expenses is perfect for calculating your emergency fund target. The general rule in the UK is 3-6 months of essential expenses.

To help determine your ideal emergency fund:
- Which expenses are truly essential (rent/mortgage, utilities, food, insurance)?
- How secure is your employment?
- Do you have any existing emergency savings?
- Would you prefer instant access or are you comfortable with notice accounts for better rates?

Current easy access savings rates in the UK are around ${this.ukFinancialContext.savingsRates.baseRate}%.`;
        }

        if (/income|job|employment/.test(input)) {
            return `Your employment situation affects how much emergency fund you need. More secure employment might mean 3 months is sufficient, while variable income might need 6+ months coverage.

For your emergency fund planning:
- What are your essential monthly expenses?
- How predictable is your income?
- Do you have any existing emergency savings?
- Are you comfortable with different types of savings accounts?

In the UK, you can use your £${this.ukFinancialContext.savingsRates.isaLimit.toLocaleString()} Cash ISA allowance for tax-free emergency savings.`;
        }

        return `Building an emergency fund is one of the most important financial foundations. In the UK, I recommend 3-6 months of essential expenses in easily accessible savings.

**To create your emergency fund plan:**
- Your monthly essential expenses (rent, utilities, food, insurance)
- Your employment security and income stability
- Any existing emergency savings
- Your preferred savings timeline

What would you like to start with? For example: "My essential expenses are £2,000 per month" or "I have £5,000 in savings currently."`;
    }

    generateInvestmentFallback(input) {
        if (/risk|conservative|aggressive/.test(input)) {
            return `Understanding your risk tolerance is crucial for UK investing. Your risk capacity (ability to take risk) and risk tolerance (willingness) both matter.

For investment planning, I'd also like to know:
- What's your investment timeline?
- Are you using your £${this.ukFinancialContext.savingsRates.isaLimit.toLocaleString()} ISA allowance?
- Are you a basic rate (20%) or higher rate (40%+) taxpayer?
- Will you invest regularly or as a lump sum?

This helps me suggest appropriate tax-efficient investments for your situation.`;
        }

        if (/isa|tax/.test(input)) {
            return `Great that you're thinking about tax efficiency! In the UK, you have £${this.ukFinancialContext.savingsRates.isaLimit.toLocaleString()} ISA allowance annually for tax-free investing.

To optimize your investment strategy:
- What's your investment timeline and goals?
- How would you describe your risk tolerance?
- Are you investing regularly or as lump sums?
- What's your current tax situation?

ISAs are perfect for most UK investors as you pay no tax on gains or income within the wrapper.`;
        }

        return `I'm here to help with tax-efficient investing in the UK. Your £${this.ukFinancialContext.savingsRates.isaLimit.toLocaleString()} annual ISA allowance is usually the best place to start.

**For your investment plan:**
- Investment timeline and specific goals
- Risk tolerance and previous experience
- Regular vs lump sum investing preference
- Current use of ISAs and other tax-efficient accounts

What would you like to explore? For example: "I want to invest £500 monthly for 10+ years" or "I have £10,000 to invest as a lump sum."`;
    }

    generateDebtFallback(input) {
        if (/debt|owe|credit/.test(input)) {
            return `Understanding your debt situation is the first step to creating a payoff strategy. In the UK, different debts have very different priority levels.

To create your debt repayment plan:
- What types of debt do you have (credit cards, loans, mortgage)?
- What are the interest rates and minimum payments?
- How much can you afford for debt repayment monthly?
- Are any debts secured against assets?

Generally, high-interest unsecured debt (like credit cards at 15-25% APR) should be prioritized over lower-rate debts.`;
        }

        if (/payment|afford|budget/.test(input)) {
            return `Knowing how much you can afford for debt repayment helps create a realistic timeline. The UK debt advice sector recommends the 'avalanche method' (highest rate first) for mathematical efficiency.

For your debt strategy:
- What's the total amount and rates of each debt?
- What are the minimum payments required?
- Would you prefer to pay off smallest balances first for motivation?
- Have you considered debt consolidation options?

I can help you compare different payoff strategies using UK interest rates and options.`;
        }

        return `I'm here to help create a UK-focused debt repayment strategy. Different types of debt need different approaches based on rates, terms, and tax implications.

**For your debt plan:**
- Types and amounts of debt
- Interest rates and minimum payments
- Monthly budget available for debt repayment
- Secured vs unsecured debt priorities

What would you like to start with? For example: "I have £8,000 credit card debt at 22% APR" or "I owe £15,000 on various debts."`;
    }

    generateEducationFallback(input) {
        if (/child|age|university/.test(input)) {
            return `Planning for education costs in the UK depends heavily on the timeline and type of education. University tuition is currently up to £9,250 per year in England.

For education planning:
- How old is your child and when will they need the money?
- Are you planning for university or other education costs?
- Do you have a Junior ISA set up (£9,000 annual limit)?
- What level of support do you want to provide?

Starting early gives your savings time to grow, and Junior ISAs provide tax-free growth until age 18.`;
        }

        return `Education funding in the UK requires long-term planning, especially with university costs. I can help create a tax-efficient savings strategy.

**For education planning:**
- Child's age and education timeline
- Expected education costs and your contribution goals
- Current education savings (Junior ISAs, etc.)
- Tax-efficient saving preferences

What would you like to start with? For example: "My child is 8 and I want to save for university" or "I want to contribute £200 monthly for education."`;
    }

    generateGeneralFallback(input) {
        // Enhanced general fallback with UK context
        if (/income|salary|earn/.test(input)) {
            return `Great! Understanding your income helps with all financial planning. In the UK for ${this.ukFinancialContext.taxYear}, you'll pay:
- No tax on the first £${this.ukFinancialContext.personalAllowance.toLocaleString()}
- ${(this.ukFinancialContext.basicTaxRate * 100)}% tax from £${this.ukFinancialContext.personalAllowance.toLocaleString()} to £${this.ukFinancialContext.basicRateThreshold.toLocaleString()}
- Plus National Insurance at ${(this.ukFinancialContext.niThresholds.rate1 * 100)}%

To provide better financial advice, could you also share:
- Your main monthly expenses
- Any key financial goals (house, retirement, etc.)
- Existing savings or investments

What's most important to you financially right now?`;
        }

        if (/goal|save|plan/.test(input)) {
            return `Having clear financial goals is excellent! The most common UK financial priorities are:

🏠 **House Purchase** - Building deposit with Help to Buy/Lifetime ISAs
🏖️ **Retirement** - Maximizing pension contributions and tax relief  
🛡️ **Emergency Fund** - 3-6 months expenses in easy access savings
📈 **Investing** - Using £${this.ukFinancialContext.savingsRates.isaLimit.toLocaleString()} ISA allowance efficiently
🎓 **Education** - Junior ISAs for children's future costs

Which of these resonates most with your situation? Or do you have different priorities?

I can provide specific UK-focused guidance once I understand your main goals.`;
        }

        return `I'm here to provide comprehensive UK financial planning guidance for ${this.ukFinancialContext.taxYear}. I understand current tax rules, ISA limits, pension regulations, and UK-specific financial products.

**I can help with:**
- Retirement and pension planning
- House buying and mortgage preparation  
- Tax-efficient investing (ISAs, SIPPs)
- Emergency fund and savings strategies
- Debt management and repayment
- Education funding planning

What's your main financial priority right now? You can start with something like:
- "I want to buy a house in 2 years"
- "I need to plan for retirement" 
- "I want to start investing £500 monthly"
- "I have debt I need to pay off"`;
    }

    // Method to analyze conversation and suggest next questions
    suggestNextQuestions(messageHistory, selectedGoal) {
        const goalType = selectedGoal || this.detectGoalFromHistory(messageHistory) || 'general';

        // Analyze what information is missing based on goal type
        const conversationText = messageHistory.join(' ').toLowerCase();

        const suggestions = {
            retirement: [
                "What's your current age and when do you want to retire?",
                "How much are you contributing to your pension currently?",
                "What's your expected annual income in retirement?",
                "Do you have workplace pension with employer matching?"
            ],
            house: [
                "What's your target property price or area?",
                "How much deposit have you saved so far?",
                "What's your household annual income?",
                "Are you a first-time buyer?"
            ],
            emergency: [
                "What are your essential monthly expenses?",
                "How secure is your employment situation?",
                "Do you have any emergency savings currently?",
                "Would you need instant access to the money?"
            ]
        };

        return suggestions[goalType] || suggestions.retirement;
    }

    // Method to detect missing information
    detectMissingInformation(extractedData, selectedGoal) {
        const missing = [];

        if (!extractedData.income || extractedData.income.length === 0) {
            missing.push('income');
        }

        if (!extractedData.expenses || extractedData.expenses.length === 0) {
            missing.push('expenses');
        }

        if (!extractedData.goals || extractedData.goals.length === 0) {
            missing.push('goals');
        }

        if (!extractedData.riskTolerance) {
            missing.push('risk tolerance');
        }

        return missing;
    }
}

export default new OpenAIService();