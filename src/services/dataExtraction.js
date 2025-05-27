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

        if (!messages || !Array.isArray(messages)) {
            return extractedData;
        }

        messages.forEach(message => {
            if (message.type === 'user' && message.content) {
                const content = message.content;
                const lowerContent = content.toLowerCase();

                // Extract income information with specific text
                const incomeData = this.extractIncomeData(content, lowerContent);
                if (incomeData) {
                    extractedData.income.push({
                        ...incomeData,
                        timestamp: message.timestamp || Date.now(),
                        category: 'income'
                    });
                }

                // Extract expense information with specific text
                const expenseData = this.extractExpenseData(content, lowerContent);
                if (expenseData) {
                    extractedData.expenses.push({
                        ...expenseData,
                        timestamp: message.timestamp || Date.now(),
                        category: 'expense'
                    });
                }

                // Extract goals with specific text
                const goalData = this.extractGoalData(content, lowerContent);
                if (goalData) {
                    extractedData.goals.push({
                        ...goalData,
                        timestamp: message.timestamp || Date.now(),
                        category: 'goal'
                    });
                }

                // Extract risk tolerance with specific text
                const riskData = this.extractRiskData(content, lowerContent);
                if (riskData) {
                    extractedData.riskTolerance = {
                        ...riskData,
                        timestamp: message.timestamp || Date.now()
                    };
                }

                // Extract assets with specific text
                const assetData = this.extractAssetData(content, lowerContent);
                if (assetData) {
                    extractedData.assets.push({
                        ...assetData,
                        timestamp: message.timestamp || Date.now(),
                        category: 'asset'
                    });
                }

                // Extract debts with specific text
                const debtData = this.extractDebtData(content, lowerContent);
                if (debtData) {
                    extractedData.debts.push({
                        ...debtData,
                        timestamp: message.timestamp || Date.now(),
                        category: 'debt'
                    });
                }
            }
        });

        return extractedData;
    }

    extractIncomeData(content, lowerContent) {
        const incomePatterns = [
            // "I earn 45k per year" -> "£45,000 per year income"
            /i\s*(earn|make|get\s*paid)\s*([£$]?\s*\d+[k]?)\s*(per\s*year|annually|a\s*year)?/i,
            // "my salary is 60000" -> "£60,000 salary"
            /(?:my\s*)?salary\s*(?:is|of)\s*([£$]?\s*\d+[k]?)/i,
            // "income of 50k" -> "£50,000 income"
            /income\s*(?:of|is)\s*([£$]?\s*\d+[k]?)/i,
            // "45k income" -> "£45,000 income"
            /([£$]?\s*\d+[k]?)\s*(?:per\s*year\s*)?income/i
        ];

        for (const pattern of incomePatterns) {
            const match = content.match(pattern);
            if (match) {
                const amounts = this.extractAmounts(match[0]);
                if (amounts.length > 0) {
                    const amount = amounts[0];
                    let text = `£${amount.toLocaleString()}`;

                    // Add frequency if mentioned
                    if (/per\s*year|annually|a\s*year/i.test(match[0])) {
                        text += ' per year';
                    }

                    // Add type
                    if (/salary/i.test(match[0])) {
                        text += ' salary';
                    } else {
                        text += ' income';
                    }

                    return {
                        text: text,
                        amounts: [amount],
                        rawText: match[0]
                    };
                }
            }
        }

        return null;
    }

    extractExpenseData(content, lowerContent) {
        const expensePatterns = [
            // "I spend 30k per year" -> "£30,000 per year expenses"
            /i\s*spend\s*([£$]?\s*\d+[k]?)\s*(per\s*year|annually|a\s*year)?/i,
            // "my expenses are 2500 per month" -> "£2,500 per month expenses"
            /(?:my\s*)?expenses\s*(?:are|of)\s*([£$]?\s*\d+[k]?)\s*(per\s*month|monthly)?/i,
            // "rent costs 1200" -> "£1,200 rent"
            /rent\s*(?:costs|is)\s*([£$]?\s*\d+[k]?)/i,
            // "mortgage of 1800" -> "£1,800 mortgage"
            /mortgage\s*(?:of|is|costs)\s*([£$]?\s*\d+[k]?)/i
        ];

        for (const pattern of expensePatterns) {
            const match = content.match(pattern);
            if (match) {
                const amounts = this.extractAmounts(match[0]);
                if (amounts.length > 0) {
                    const amount = amounts[0];
                    let text = `£${amount.toLocaleString()}`;

                    // Add frequency if mentioned
                    if (/per\s*year|annually|a\s*year/i.test(match[0])) {
                        text += ' per year';
                    } else if (/per\s*month|monthly/i.test(match[0])) {
                        text += ' per month';
                    }

                    // Add type
                    if (/rent/i.test(match[0])) {
                        text += ' rent';
                    } else if (/mortgage/i.test(match[0])) {
                        text += ' mortgage';
                    } else {
                        text += ' expenses';
                    }

                    return {
                        text: text,
                        amounts: [amount],
                        rawText: match[0]
                    };
                }
            }
        }

        return null;
    }

    extractGoalData(content, lowerContent) {
        const goalPatterns = [
            // "I want to retire at 55" -> "Retire at 55"
            /i\s*want\s*to\s*retire\s*(?:at|by)\s*(\d+)/i,
            // "retire at 60" -> "Retire at 60"
            /retire\s*(?:at|by)\s*(\d+)/i,
            // "I want to buy a house" -> "Buy a house"
            /i\s*want\s*to\s*buy\s*(?:a\s*)?(house|home|property|car)/i,
            // "save for a house" -> "Save for a house"
            /save\s*for\s*(?:a\s*)?(house|home|property|car|holiday|vacation|wedding)/i,
            // "my goal is to buy" -> "Buy [item]"
            /(?:my\s*)?goal\s*is\s*to\s*(buy|save|retire|invest)/i,
            // "plan to retire" -> "Plan to retire"
            /plan\s*to\s*(retire|buy|save)/i
        ];

        for (const pattern of goalPatterns) {
            const match = content.match(pattern);
            if (match) {
                let text = '';

                if (/retire/i.test(match[0])) {
                    if (match[1] && !isNaN(match[1])) {
                        text = `Retire at ${match[1]}`;
                    } else {
                        text = 'Retirement goal';
                    }
                } else if (/buy/i.test(match[0])) {
                    const item = match[1] || this.extractItemAfterBuy(content);
                    text = `Buy ${item || 'property'}`;
                } else if (/save/i.test(match[0])) {
                    const item = match[1] || 'savings goal';
                    text = `Save for ${item}`;
                } else {
                    text = this.capitalizeFirst(match[0].replace(/^i\s*/i, ''));
                }

                const amounts = this.extractAmounts(match[0]);
                const goalTypes = this.categorizeGoal(match[0]);

                return {
                    text: text,
                    type: goalTypes,
                    amounts: amounts,
                    timeframes: this.extractTimeframes(match[0]),
                    rawText: match[0]
                };
            }
        }

        return null;
    }

    extractRiskData(content, lowerContent) {
        const riskPatterns = [
            // "I am a medium risk investor" -> "Medium risk investor"
            /i\s*am\s*(?:a\s*)?(low|medium|high|conservative|aggressive)\s*risk\s*investor/i,
            // "medium risk tolerance" -> "Medium risk tolerance"
            /(low|medium|high|conservative|aggressive)\s*risk\s*(?:tolerance|investor|profile)?/i,
            // "I am conservative" -> "Conservative investor"
            /i\s*am\s*(conservative|aggressive|cautious|careful|adventurous)/i
        ];

        for (const pattern of riskPatterns) {
            const match = content.match(pattern);
            if (match) {
                const level = this.assessRiskLevel(match[0]);
                const riskWord = match[1] || level;

                let text = '';
                if (/investor/i.test(match[0])) {
                    text = `${this.capitalizeFirst(riskWord)} risk investor`;
                } else {
                    text = `${this.capitalizeFirst(riskWord)} risk tolerance`;
                }

                return {
                    text: text,
                    level: level,
                    rawText: match[0]
                };
            }
        }

        return null;
    }

    extractAssetData(content, lowerContent) {
        const assetPatterns = [
            /(?:i\s*have\s*)?savings\s*of\s*([£$]?\s*\d+[k]?)/i,
            /([£$]?\s*\d+[k]?)\s*(?:in\s*)?savings/i,
            /portfolio\s*(?:worth|of)\s*([£$]?\s*\d+[k]?)/i
        ];

        for (const pattern of assetPatterns) {
            const match = content.match(pattern);
            if (match) {
                const amounts = this.extractAmounts(match[0]);
                if (amounts.length > 0) {
                    const amount = amounts[0];
                    let text = '';

                    if (/savings/i.test(match[0])) {
                        text = `£${amount.toLocaleString()} savings`;
                    } else if (/portfolio/i.test(match[0])) {
                        text = `£${amount.toLocaleString()} portfolio`;
                    } else {
                        text = `£${amount.toLocaleString()} assets`;
                    }

                    return {
                        text: text,
                        amounts: [amount],
                        rawText: match[0]
                    };
                }
            }
        }

        return null;
    }

    extractDebtData(content, lowerContent) {
        const debtPatterns = [
            /(?:i\s*)?owe\s*([£$]?\s*\d+[k]?)/i,
            /debt\s*of\s*([£$]?\s*\d+[k]?)/i,
            /([£$]?\s*\d+[k]?)\s*(?:in\s*)?debt/i
        ];

        for (const pattern of debtPatterns) {
            const match = content.match(pattern);
            if (match) {
                const amounts = this.extractAmounts(match[0]);
                if (amounts.length > 0) {
                    const amount = amounts[0];
                    const text = `£${amount.toLocaleString()} debt`;

                    return {
                        text: text,
                        amounts: [amount],
                        rawText: match[0]
                    };
                }
            }
        }

        return null;
    }

    // Helper functions
    extractItemAfterBuy(content) {
        const buyMatch = content.match(/buy\s*(?:a\s*)?(house|home|property|car|vehicle)/i);
        return buyMatch ? buyMatch[1] : null;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    extractAmounts(text) {
        if (!text || typeof text !== 'string') return [];

        const patterns = [
            /£\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g,
            /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:pounds|quid)/g,
            /(\d+)k/g,
            /(\d+)\s*thousand/g,
            /(\d+)\s*million/g,
            /\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g,
            /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars)/g
        ];

        const amounts = [];
        patterns.forEach((pattern, index) => {
            const matches = [...text.matchAll(pattern)];
            matches.forEach(match => {
                let amount = parseFloat(match[1].replace(/,/g, ''));

                if (index === 2 || text.includes('k')) {
                    amount *= 1000;
                } else if (index === 3 || text.includes('thousand')) {
                    amount *= 1000;
                } else if (index === 4 || text.includes('million')) {
                    amount *= 1000000;
                }

                if (!isNaN(amount) && amount > 0) {
                    amounts.push(amount);
                }
            });
        });

        return [...new Set(amounts)];
    }

    extractTimeframes(text) {
        if (!text || typeof text !== 'string') return [];

        const timePatterns = [
            /(\d+)\s*(year|years)/gi,
            /(\d+)\s*(month|months)/gi,
            /(\d+)\s*(week|weeks)/gi,
            /(\d+)\s*(day|days)/gi
        ];

        const timeframes = [];
        timePatterns.forEach(pattern => {
            const matches = [...text.matchAll(pattern)];
            matches.forEach(match => {
                const value = parseInt(match[1]);
                if (!isNaN(value) && value > 0) {
                    timeframes.push({
                        value: value,
                        unit: match[2].toLowerCase()
                    });
                }
            });
        });

        return timeframes;
    }

    categorizeGoal(text) {
        if (!text || typeof text !== 'string') return [];

        const goalTypes = {
            retirement: /retire|pension|retirement/i.test(text),
            house: /house|home|property|buy.*house|mortgage/i.test(text),
            emergency: /emergency|fund|rainy.*day|emergency.*fund/i.test(text),
            education: /education|university|school|college|course/i.test(text),
            travel: /travel|holiday|vacation|trip/i.test(text),
            debt: /debt|pay.*off|clear.*debt|pay.*down/i.test(text),
            investment: /invest|investment|portfolio|stocks|shares/i.test(text),
            car: /car|vehicle|auto/i.test(text),
            wedding: /wedding|marriage|marry/i.test(text),
            business: /business|startup|company/i.test(text)
        };

        return Object.keys(goalTypes).filter(type => goalTypes[type]);
    }

    assessRiskLevel(text) {
        if (!text || typeof text !== 'string') return 'unknown';

        const lowRiskTerms = /safe|secure|conservative|careful|low.*risk|cautious|stable|guaranteed/i;
        const highRiskTerms = /aggressive|high.*risk|volatile|adventurous|risky|speculative/i;
        const mediumRiskTerms = /moderate|balanced|medium.*risk|moderate.*risk/i;

        if (lowRiskTerms.test(text)) {
            return 'low';
        } else if (highRiskTerms.test(text)) {
            return 'high';
        } else if (mediumRiskTerms.test(text)) {
            return 'medium';
        }

        return 'unknown';
    }

    calculateCompletionScore(extractedData) {
        if (!extractedData) return 0;

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
        if (!extractedData) return [];

        const insights = [];

        if (extractedData.income && extractedData.income.length > 0) {
            const incomeAmounts = extractedData.income.flatMap(item => item.amounts || []);
            if (incomeAmounts.length > 0) {
                const avgIncome = incomeAmounts.reduce((sum, amount) => sum + amount, 0) / incomeAmounts.length;
                insights.push({
                    type: 'income',
                    message: `Based on your income information, you have an average income of £${avgIncome.toLocaleString()}.`,
                    value: avgIncome
                });
            }
        }

        if (extractedData.goals && extractedData.goals.length > 0) {
            const goalTypes = extractedData.goals.flatMap(goal => goal.type || []);
            const uniqueGoals = [...new Set(goalTypes)];
            if (uniqueGoals.length > 0) {
                insights.push({
                    type: 'goals',
                    message: `You've mentioned ${uniqueGoals.length} main financial goals: ${uniqueGoals.join(', ')}.`,
                    value: uniqueGoals
                });
            }
        }

        if (extractedData.expenses && extractedData.expenses.length > 0) {
            const allAmounts = extractedData.expenses.flatMap(item => item.amounts || []);
            if (allAmounts.length > 0) {
                const total = allAmounts.reduce((sum, val) => sum + val, 0);
                insights.push({
                    type: 'expenses',
                    message: `You've mentioned ${extractedData.expenses.length} expense items totaling approximately £${total.toLocaleString()}.`,
                    value: total
                });
            }
        }

        if (extractedData.riskTolerance && extractedData.riskTolerance.level !== 'unknown') {
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
  