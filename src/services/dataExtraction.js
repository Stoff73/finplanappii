class DataExtractionService {
    extractFinancialData(messages) {
        const extractedData = {
            income: [],
            expenses: [],
            goals: [],
            assets: [],
            debts: [],
            riskTolerance: null,
            timeline: []
        };

        messages.forEach(message => {
            if (message.type === 'user') {
                const content = message.content.toLowerCase();

                // Extract income information
                const incomeKeywords = ['earn', 'income', 'salary', 'wage', 'make'];
                const incomeAmounts = this.extractAmounts(content);
                if (incomeKeywords.some(keyword => content.includes(keyword)) && incomeAmounts.length > 0) {
                    extractedData.income.push({
                        text: message.content,
                        amounts: incomeAmounts,
                        timestamp: message.timestamp
                    });
                }

                // Extract expenses
                const expenseKeywords = ['spend', 'cost', 'expenses', 'bills', 'rent', 'mortgage'];
                const expenseAmounts = this.extractAmounts(content);
                if (expenseKeywords.some(keyword => content.includes(keyword)) && expenseAmounts.length > 0) {
                    extractedData.expenses.push({
                        text: message.content,
                        amounts: expenseAmounts,
                        timestamp: message.timestamp
                    });
                }

                // Extract goals
                const goalKeywords = ['goal', 'want', 'plan', 'save for', 'buy', 'retire', 'house'];
                if (goalKeywords.some(keyword => content.includes(keyword))) {
                    extractedData.goals.push({
                        text: message.content,
                        type: this.categorizeGoal(content),
                        amounts: this.extractAmounts(content),
                        timeframes: this.extractTimeframes(content),
                        timestamp: message.timestamp
                    });
                }

                // Extract risk tolerance
                const riskKeywords = ['risk', 'safe', 'conservative', 'aggressive', 'volatile'];
                if (riskKeywords.some(keyword => content.includes(keyword))) {
                    extractedData.riskTolerance = {
                        text: message.content,
                        level: this.assessRiskLevel(content),
                        timestamp: message.timestamp
                    };
                }
            }
        });

        return extractedData;
    }

    extractAmounts(text) {
        // Match various currency formats
        const patterns = [
            /£\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g,
            /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:pounds|quid)/g,
            /(\d+)k/g, // e.g., "30k"
            /(\d+)\s*thousand/g
        ];

        const amounts = [];
        patterns.forEach(pattern => {
            const matches = [...text.matchAll(pattern)];
            matches.forEach(match => {
                let amount = parseFloat(match[1].replace(/,/g, ''));
                if (text.includes('k') || text.includes('thousand')) {
                    amount *= 1000;
                }
                amounts.push(amount);
            });
        });

        return amounts;
    }

    extractTimeframes(text) {
        const timePatterns = [
            /(\d+)\s*(year|years)/g,
            /(\d+)\s*(month|months)/g,
            /(\d+)\s*(week|weeks)/g
        ];

        const timeframes = [];
        timePatterns.forEach(pattern => {
            const matches = [...text.matchAll(pattern)];
            matches.forEach(match => {
                timeframes.push({
                    value: parseInt(match[1]),
                    unit: match[2]
                });
            });
        });

        return timeframes;
    }

    categorizeGoal(text) {
        const goalTypes = {
            retirement: /retire|pension/i.test(text),
            house: /house|home|property|buy.*house/i.test(text),
            emergency: /emergency|fund|rainy.*day/i.test(text),
            education: /education|university|school/i.test(text),
            travel: /travel|holiday|vacation/i.test(text),
            debt: /debt|pay.*off|clear.*debt/i.test(text),
            investment: /invest|investment|portfolio/i.test(text)
        };

        return Object.keys(goalTypes).filter(type => goalTypes[type]);
    }

    assessRiskLevel(text) {
        if (/safe|secure|conservative|careful|low.*risk/i.test(text)) {
            return 'low';
        } else if (/aggressive|high.*risk|volatile|adventurous/i.test(text)) {
            return 'high';
        } else if (/moderate|balanced|medium.*risk/i.test(text)) {
            return 'medium';
        }
        return 'unknown';
    }

    calculateCompletionScore(extractedData) {
        const sections = [
            { key: 'income', weight: 25 },
            { key: 'expenses', weight: 20 },
            { key: 'goals', weight: 30 },
            { key: 'riskTolerance', weight: 15 },
            { key: 'assets', weight: 10 }
        ];

        let totalScore = 0;
        sections.forEach(section => {
            const data = extractedData[section.key];
            if (data && (Array.isArray(data) ? data.length > 0 : data !== null)) {
                totalScore += section.weight;
            }
        });

        return Math.min(totalScore, 100);
    }

    generateInsights(extractedData) {
        const insights = [];

        // Income insights
        if (extractedData.income.length > 0) {
            const incomeAmounts = extractedData.income.flatMap(item => item.amounts);
            const avgIncome = incomeAmounts.reduce((sum, amount) => sum + amount, 0) / incomeAmounts.length;
            insights.push({
                type: 'income',
                message: `Based on your income information, you have an average income of £${avgIncome.toLocaleString()}.`,
                value: avgIncome
            });
        }

        // Goals insights
        if (extractedData.goals.length > 0) {
            const goalTypes = extractedData.goals.flatMap(goal => goal.type);
            const uniqueGoals = [...new Set(goalTypes)];
            insights.push({
                type: 'goals',
                message: `You've mentioned ${uniqueGoals.length} main financial goals: ${uniqueGoals.join(', ')}.`,
                value: uniqueGoals
            });
        }

        // Risk tolerance insights
        if (extractedData.riskTolerance) {
            insights.push({
                type: 'risk',
                message: `Your risk tolerance appears to be ${extractedData.riskTolerance.level}.`,
                value: extractedData.riskTolerance.level
            });
        }

        return insights;
    }
}

export default new DataExtractionService();
  