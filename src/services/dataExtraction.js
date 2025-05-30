// src/services/dataExtraction.js
class DataExtractionService {
    constructor() {
        // Enhanced with UK-specific financial context
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
                isaLimit: 20000
            }
        };

        // Goal-specific data requirements
        this.goalRequirements = {
            retirement: {
                critical: ['income', 'riskTolerance', 'goals'],
                important: ['expenses', 'assets'],
                optional: ['debts', 'timeline']
            },
            house: {
                critical: ['income', 'expenses', 'goals'],
                important: ['assets', 'debts'],
                optional: ['riskTolerance', 'timeline']
            },
            emergency: {
                critical: ['expenses', 'goals'],
                important: ['income', 'assets'],
                optional: ['debts', 'riskTolerance']
            },
            investment: {
                critical: ['income', 'riskTolerance', 'goals'],
                important: ['assets', 'expenses'],
                optional: ['debts', 'timeline']
            },
            debt: {
                critical: ['debts', 'income', 'expenses'],
                important: ['goals'],
                optional: ['assets', 'riskTolerance']
            },
            education: {
                critical: ['goals', 'income'],
                important: ['assets', 'expenses'],
                optional: ['debts', 'riskTolerance']
            }
        };
    }

    extractFinancialData(messages, goalContext = null) {
        const extractedData = {
            income: [],
            expenses: [],
            goals: [],
            assets: [],
            debts: [],
            riskTolerance: null,
            timeline: [],
            goalContext: goalContext,
            extractionMetadata: {
                totalMessages: messages.length,
                userMessages: 0,
                extractionDate: new Date().toISOString(),
                goalFocused: !!goalContext
            }
        };

        if (!messages || !Array.isArray(messages)) {
            return extractedData;
        }

        const userMessages = messages.filter(msg => msg.type === 'user');
        extractedData.extractionMetadata.userMessages = userMessages.length;

        messages.forEach(message => {
            if (message.type === 'user' && message.content) {
                const content = message.content;
                const lowerContent = content.toLowerCase();

                // Enhanced extraction with goal context
                const incomeData = this.extractIncomeData(content, lowerContent, goalContext);
                if (incomeData) {
                    extractedData.income.push({
                        ...incomeData,
                        timestamp: message.timestamp || Date.now(),
                        category: 'income',
                        goalRelevance: this.calculateGoalRelevance('income', goalContext)
                    });
                }

                const expenseData = this.extractExpenseData(content, lowerContent, goalContext);
                if (expenseData) {
                    if (Array.isArray(expenseData)) {
                        expenseData.forEach(expense => {
                            extractedData.expenses.push({
                                ...expense,
                                timestamp: message.timestamp || Date.now(),
                                category: 'expense',
                                goalRelevance: this.calculateGoalRelevance('expense', goalContext)
                            });
                        });
                    } else {
                        extractedData.expenses.push({
                            ...expenseData,
                            timestamp: message.timestamp || Date.now(),
                            category: 'expense',
                            goalRelevance: this.calculateGoalRelevance('expense', goalContext)
                        });
                    }
                }

                const goalData = this.extractGoalData(content, lowerContent, goalContext);
                if (goalData) {
                    extractedData.goals.push({
                        ...goalData,
                        timestamp: message.timestamp || Date.now(),
                        category: 'goal',
                        goalRelevance: this.calculateGoalRelevance('goal', goalContext)
                    });
                }

                const riskData = this.extractRiskData(content, lowerContent, goalContext);
                if (riskData) {
                    extractedData.riskTolerance = {
                        ...riskData,
                        timestamp: message.timestamp || Date.now(),
                        goalRelevance: this.calculateGoalRelevance('risk', goalContext)
                    };
                }

                const assetData = this.extractAssetData(content, lowerContent, goalContext);
                if (assetData) {
                    extractedData.assets.push({
                        ...assetData,
                        timestamp: message.timestamp || Date.now(),
                        category: 'asset',
                        goalRelevance: this.calculateGoalRelevance('asset', goalContext)
                    });
                }

                const debtData = this.extractDebtData(content, lowerContent, goalContext);
                if (debtData) {
                    extractedData.debts.push({
                        ...debtData,
                        timestamp: message.timestamp || Date.now(),
                        category: 'debt',
                        goalRelevance: this.calculateGoalRelevance('debt', goalContext)
                    });
                }

                const timelineData = this.extractTimelineData(content, lowerContent, goalContext);
                if (timelineData) {
                    extractedData.timeline.push({
                        ...timelineData,
                        timestamp: message.timestamp || Date.now(),
                        category: 'timeline',
                        goalRelevance: this.calculateGoalRelevance('timeline', goalContext)
                    });
                }
            }
        });

        return extractedData;
    }

    calculateGoalRelevance(dataType, goalContext) {
        if (!goalContext || !this.goalRequirements[goalContext]) {
            return 50; // Neutral relevance
        }

        const requirements = this.goalRequirements[goalContext];

        if (requirements.critical.includes(dataType)) {
            return 100; // Highly relevant
        } else if (requirements.important.includes(dataType)) {
            return 75; // Important
        } else if (requirements.optional.includes(dataType)) {
            return 25; // Less relevant
        }

        return 50; // Neutral
    }

    // Enhanced extraction methods with goal context
    extractIncomeData(content, lowerContent, goalContext) {
        const incomePatterns = [
            /i\s*(earn|make|get\s*paid)\s*([£$]?\s*\d+[k]?)\s*(per\s*year|annually|a\s*year)/i,
            /i\s*(earn|make|get\s*paid)\s*([£$]?\s*\d+[k]?)\s*(per\s*month|monthly)/i,
            /i\s*(earn|make|get\s*paid)\s*([£$]?\s*\d+[k]?)\s*(per\s*week|weekly)/i,
            /i\s*(earn|make|get\s*paid)\s*([£$]?\s*\d+[k]?)\s*(?:at\s*my\s*job|from\s*work|employment|salary)?/i,
            /(?:my\s*)?salary\s*(?:is|of)\s*([£$]?\s*\d+[k]?)/i,
            /income\s*(?:of|is)\s*([£$]?\s*\d+[k]?)/i,
            /([£$]?\s*\d+[k]?)\s*(?:per\s*year\s*)?(?:annual\s*)?income/i,
            // Enhanced patterns for pension income (retirement goal)
            /pension\s*income\s*(?:of|is)\s*([£$]?\s*\d+[k]?)/i,
            /state\s*pension\s*(?:of|is)\s*([£$]?\s*\d+[k]?)/i,
            // Enhanced patterns for rental income (investment goal)
            /rental\s*income\s*(?:of|is)\s*([£$]?\s*\d+[k]?)/i,
            /property\s*income\s*(?:of|is)\s*([£$]?\s*\d+[k]?)/i
        ];

        for (let i = 0; i < incomePatterns.length; i++) {
            const pattern = incomePatterns[i];
            const match = content.match(pattern);
            if (match) {
                const amounts = this.extractAmounts(match[0]);

                if (amounts.length > 0) {
                    const amount = amounts[0];
                    let text = `£${amount.toLocaleString()}`;
                    let frequency = 'yearly';
                    let incomeType = 'employment';

                    // Enhanced frequency detection
                    if (match[3] || /per\s*month|monthly/i.test(match[0])) {
                        frequency = 'monthly';
                        text += ' per month';
                    } else if (/per\s*week|weekly/i.test(match[0])) {
                        frequency = 'weekly';
                        text += ' per week';
                    } else if (/per\s*year|annually|yearly/i.test(match[0])) {
                        frequency = 'yearly';
                        text += ' per year';
                    } else {
                        // Smart frequency detection based on amount and goal context
                        if (goalContext === 'retirement' && amount < 20000) {
                            frequency = 'yearly';
                            text += ' per year (pension)';
                        } else if (amount > 50000) {
                            frequency = 'yearly';
                            text += ' per year';
                        } else if (amount > 4000) {
                            frequency = 'monthly';
                            text += ' per month';
                        } else {
                            frequency = 'weekly';
                            text += ' per week';
                        }
                    }

                    // Enhanced type detection
                    if (/pension|retirement/i.test(match[0])) {
                        incomeType = 'pension';
                        text += ' pension income';
                    } else if (/rental|property/i.test(match[0])) {
                        incomeType = 'rental';
                        text += ' rental income';
                    } else if (/salary/i.test(match[0])) {
                        incomeType = 'salary';
                        text += ' salary';
                    } else if (/business|self.*employed/i.test(match[0])) {
                        incomeType = 'business';
                        text += ' business income';
                    } else {
                        text += ' employment income';
                    }

                    return {
                        text: text,
                        amounts: [amount],
                        frequency: frequency,
                        incomeType: incomeType,
                        rawText: match[0],
                        ukTaxImplications: this.calculateTaxImplications(amount, frequency)
                    };
                }
            }
        }

        return null;
    }

    extractExpenseData(content, lowerContent, goalContext) {
        const expenses = [];

        const expensePatterns = [
            { pattern: /rent\s*(?:costs|is)\s*([£$]?\s*\d+[,\d]*)\s*(?:per\s*month|monthly)?/i, type: 'housing', category: 'rent' },
            { pattern: /mortgage\s*(?:of|is|costs)\s*([£$]?\s*\d+[,\d]*)/i, type: 'housing', category: 'mortgage' },
            { pattern: /(?:spend|spent)\s*([£$]?\s*\d+[,\d]*)\s*on\s*(\w+)/i, type: 'variable', category: 'variable' },
            { pattern: /i\s*spend\s*([£$]?\s*\d+[k]?)\s*(per\s*year|annually|a\s*year)/i, type: 'general', category: 'total' },
            { pattern: /(?:my\s*)?expenses\s*(?:are|of)\s*([£$]?\s*\d+[k]?)\s*(per\s*month|monthly)/i, type: 'general', category: 'total' },
            { pattern: /costs?\s*([£$]?\s*\d+[k]?)/i, type: 'general', category: 'general' },
            { pattern: /outgoings?\s*(?:of|are)\s*([£$]?\s*\d+[k]?)/i, type: 'general', category: 'total' },
            // Enhanced patterns for goal-specific expenses
            { pattern: /childcare\s*(?:costs|is)\s*([£$]?\s*\d+[,\d]*)/i, type: 'education', category: 'childcare' },
            { pattern: /school\s*fees\s*(?:of|are)\s*([£$]?\s*\d+[,\d]*)/i, type: 'education', category: 'school_fees' },
            { pattern: /debt\s*payments?\s*(?:of|are)\s*([£$]?\s*\d+[,\d]*)/i, type: 'debt', category: 'debt_payment' }
        ];

        expensePatterns.forEach((patternObj, patternIndex) => {
            let searchContent = content;
            let match;
            let attempts = 0;
            const maxAttempts = 10;

            while ((match = patternObj.pattern.exec(searchContent)) !== null && attempts < maxAttempts) {
                attempts++;
                const amounts = this.extractAmounts(match[0]);

                if (amounts.length > 0) {
                    const amount = amounts[0];
                    let text = `£${amount.toLocaleString()}`;
                    let frequency = 'monthly';
                    let expenseCategory = patternObj.category;

                    // Enhanced frequency detection
                    if (/per\s*year|annually|yearly/i.test(match[0])) {
                        text += ' per year';
                        frequency = 'yearly';
                    } else if (/per\s*month|monthly/i.test(match[0]) || /rent|mortgage/i.test(match[0])) {
                        text += ' per month';
                        frequency = 'monthly';
                    } else if (/per\s*week|weekly/i.test(match[0])) {
                        text += ' per week';
                        frequency = 'weekly';
                    } else {
                        // Smart frequency based on amount and context
                        if (amount > 50000) {
                            text += ' per year';
                            frequency = 'yearly';
                        } else {
                            text += ' per month';
                            frequency = 'monthly';
                        }
                    }

                    // Enhanced categorization
                    if (patternObj.type === 'housing') {
                        if (/rent/i.test(match[0])) {
                            text += ' rent';
                            expenseCategory = 'rent';
                        } else if (/mortgage/i.test(match[0])) {
                            text += ' mortgage payment';
                            expenseCategory = 'mortgage';
                        }
                    } else if (patternObj.type === 'variable' && match[2]) {
                        const expenseType = this.categorizeExpenseType(match[2]);
                        text += ` on ${expenseType}`;
                        expenseCategory = expenseType;
                    } else if (patternObj.type === 'education') {
                        text += ` ${expenseCategory.replace('_', ' ')}`;
                    } else if (patternObj.type === 'debt') {
                        text += ' debt payments';
                    } else {
                        text += ' expenses';
                    }

                    const isDuplicate = expenses.some(existing =>
                        existing.text === text && existing.amounts[0] === amount
                    );

                    if (!isDuplicate) {
                        expenses.push({
                            text: text,
                            amounts: [amount],
                            frequency: frequency,
                            rawText: match[0],
                            category: expenseCategory,
                            expenseType: patternObj.type,
                            goalSpecific: this.isGoalSpecificExpense(expenseCategory, goalContext)
                        });
                    }
                }

                searchContent = searchContent.replace(match[0], ' MATCHED_EXPENSE ');
                patternObj.pattern.lastIndex = 0;
            }
        });

        return expenses.length > 0 ? expenses : null;
    }

    extractGoalData(content, lowerContent, goalContext) {
        const goalPatterns = [
            // Enhanced retirement patterns
            /i\s*want\s*to\s*retire\s*(?:at|by)\s*(\d+)/i,
            /retire\s*(?:at|by)\s*(\d+)/i,
            /retirement\s*(?:at|by)\s*(?:age\s*)?(\d+)/i,
            /pension\s*(?:at|by)\s*(\d+)/i,
            // Enhanced house buying patterns
            /i\s*want\s*to\s*buy\s*(?:a\s*)?(house|home|property)\s*(?:for|worth|costing)?\s*([£$]?\s*\d+[k]?)?/i,
            /buy\s*(?:a\s*)?(house|home|property)\s*(?:for|worth|costing)?\s*([£$]?\s*\d+[k]?)?/i,
            /save\s*for\s*(?:a\s*)?(house|home|property|deposit)/i,
            // Enhanced emergency fund patterns
            /emergency\s*fund\s*(?:of|worth)?\s*([£$]?\s*\d+[k]?)?/i,
            /save\s*([£$]?\s*\d+[k]?)\s*for\s*emergencies/i,
            // Enhanced investment patterns
            /invest\s*([£$]?\s*\d+[k]?)\s*(?:per\s*month|monthly)?/i,
            /investment\s*(?:of|worth)\s*([£$]?\s*\d+[k]?)/i,
            // Enhanced education patterns
            /save\s*for\s*(?:child|children|education|university)/i,
            /university\s*fees\s*(?:of|costing)\s*([£$]?\s*\d+[k]?)?/i,
            // Enhanced debt patterns
            /pay\s*off\s*(?:my\s*)?debt/i,
            /clear\s*(?:my\s*)?debt/i,
            /debt\s*free/i,
            // General goal patterns
            /(?:my\s*)?goal\s*is\s*to\s*(buy|save|retire|invest|pay)/i,
            /plan\s*to\s*(retire|buy|save|invest)/i,
            /want\s*to\s*be\s*financially\s*(?:secure|independent)/i
        ];

        for (const pattern of goalPatterns) {
            const match = content.match(pattern);
            if (match) {
                let text = '';
                let goalTypes = [];
                let amounts = [];
                let timeframes = [];

                // Enhanced goal categorization based on context
                if (/retire|retirement|pension/i.test(match[0])) {
                    if (match[1] && !isNaN(match[1])) {
                        text = `Retire at age ${match[1]}`;
                        timeframes = [{ value: parseInt(match[1]), unit: 'age' }];
                    } else {
                        text = 'Retirement planning';
                    }
                    goalTypes = ['retirement'];
                } else if (/buy.*house|buy.*home|buy.*property/i.test(match[0])) {
                    const item = match[1] || 'property';
                    const amount = match[2] ? this.extractAmounts(match[2])[0] : null;
                    text = `Buy a ${item}`;
                    if (amount) {
                        text += ` for £${amount.toLocaleString()}`;
                        amounts = [amount];
                    }
                    goalTypes = ['house', 'property'];
                } else if (/emergency/i.test(match[0])) {
                    const amount = match[1] ? this.extractAmounts(match[1])[0] : null;
                    text = 'Build emergency fund';
                    if (amount) {
                        text += ` of £${amount.toLocaleString()}`;
                        amounts = [amount];
                    }
                    goalTypes = ['emergency', 'savings'];
                } else if (/invest|investment/i.test(match[0])) {
                    const amount = match[1] ? this.extractAmounts(match[1])[0] : null;
                    text = 'Start investing';
                    if (amount) {
                        if (/per\s*month|monthly/i.test(match[0])) {
                            text += ` £${amount.toLocaleString()} monthly`;
                        } else {
                            text += ` £${amount.toLocaleString()}`;
                        }
                        amounts = [amount];
                    }
                    goalTypes = ['investment', 'wealth building'];
                } else if (/education|university|child/i.test(match[0])) {
                    const amount = match[1] ? this.extractAmounts(match[1])[0] : null;
                    text = 'Save for education';
                    if (amount) {
                        text += ` (£${amount.toLocaleString()})`;
                        amounts = [amount];
                    }
                    goalTypes = ['education', 'children'];
                } else if (/debt|pay.*off|clear/i.test(match[0])) {
                    text = 'Pay off debts';
                    goalTypes = ['debt', 'debt management'];
                } else if (/financial.*secure|financial.*independent/i.test(match[0])) {
                    text = 'Achieve financial independence';
                    goalTypes = ['financial independence', 'wealth building'];
                } else {
                    text = this.capitalizeFirst(match[0].replace(/^i\s*/i, ''));
                    goalTypes = this.categorizeGoal(match[0]);
                }

                // Add goal context relevance
                if (goalContext && !goalTypes.includes(goalContext)) {
                    goalTypes.unshift(goalContext);
                }

                // Extract any additional amounts and timeframes
                if (amounts.length === 0) {
                    amounts = this.extractAmounts(match[0]);
                }
                if (timeframes.length === 0) {
                    timeframes = this.extractTimeframes(match[0]);
                }

                return {
                    text: text,
                    type: goalTypes,
                    amounts: amounts,
                    timeframes: timeframes,
                    rawText: match[0],
                    priority: this.calculateGoalPriority(goalTypes, goalContext),
                    ukSpecific: this.addUKGoalContext(goalTypes)
                };
            }
        }

        return null;
    }

    // Enhanced helper methods
    calculateTaxImplications(amount, frequency) {
        let annualAmount = amount;

        // Convert to annual
        if (frequency === 'monthly') {
            annualAmount = amount * 12;
        } else if (frequency === 'weekly') {
            annualAmount = amount * 52;
        }

        const personalAllowance = this.ukFinancialContext.personalAllowance;
        const basicRateThreshold = this.ukFinancialContext.basicRateThreshold;
        const higherRateThreshold = this.ukFinancialContext.higherRateThreshold;

        let taxBand = 'personal_allowance';
        let taxRate = 0;
        let annualTax = 0;

        if (annualAmount > personalAllowance) {
            if (annualAmount <= basicRateThreshold) {
                taxBand = 'basic_rate';
                taxRate = this.ukFinancialContext.basicTaxRate;
                annualTax = (annualAmount - personalAllowance) * taxRate;
            } else if (annualAmount <= higherRateThreshold) {
                taxBand = 'higher_rate';
                taxRate = this.ukFinancialContext.higherTaxRate;
                annualTax = (basicRateThreshold - personalAllowance) * this.ukFinancialContext.basicTaxRate +
                    (annualAmount - basicRateThreshold) * taxRate;
            } else {
                taxBand = 'additional_rate';
                taxRate = this.ukFinancialContext.additionalTaxRate;
                annualTax = (basicRateThreshold - personalAllowance) * this.ukFinancialContext.basicTaxRate +
                    (higherRateThreshold - basicRateThreshold) * this.ukFinancialContext.higherTaxRate +
                    (annualAmount - higherRateThreshold) * taxRate;
            }
        }

        return {
            annualGross: annualAmount,
            annualTax: Math.round(annualTax),
            annualNet: Math.round(annualAmount - annualTax),
            monthlyNet: Math.round((annualAmount - annualTax) / 12),
            taxBand: taxBand,
            marginalRate: taxRate
        };
    }

    isGoalSpecificExpense(category, goalContext) {
        const goalExpenseMap = {
            retirement: ['pension', 'investment', 'savings'],
            house: ['rent', 'mortgage', 'deposit', 'property'],
            emergency: ['insurance', 'healthcare'],
            investment: ['investment', 'savings'],
            debt: ['debt_payment', 'credit_card', 'loan'],
            education: ['childcare', 'school_fees', 'education']
        };

        return goalContext && goalExpenseMap[goalContext]?.includes(category);
    }

    calculateGoalPriority(goalTypes, goalContext) {
        if (goalContext && goalTypes.includes(goalContext)) {
            return 'high';
        }

        // UK financial planning priorities
        const priorityOrder = ['emergency', 'debt', 'retirement', 'house', 'investment', 'education'];

        for (const priority of priorityOrder) {
            if (goalTypes.includes(priority)) {
                return priorityOrder.indexOf(priority) < 2 ? 'high' : 'medium';
            }
        }

        return 'low';
    }

    addUKGoalContext(goalTypes) {
        const ukContext = {};

        goalTypes.forEach(type => {
            switch (type) {
                case 'retirement':
                    ukContext.statePensionAge = this.ukFinancialContext.regulations?.retirementAge || 67;
                    ukContext.annualAllowance = this.ukFinancialContext.pensionContributions.annualAllowance;
                    break;
                case 'house':
                    ukContext.firstTimeBuyerSchemes = ['Help to Buy ISA', 'Lifetime ISA', 'Shared Ownership'];
                    ukContext.stampDutyThreshold = 250000;
                    break;
                case 'investment':
                    ukContext.isaAllowance = this.ukFinancialContext.savingsRates.isaLimit;
                    ukContext.capitalGainsAllowance = 3000;
                    break;
                case 'emergency':
                    ukContext.recommendedMonths = '3-6 months expenses';
                    ukContext.savingsRate = this.ukFinancialContext.savingsRates.baseRate;
                    break;
            }
        });

        return ukContext;
    }

    extractTimelineData(content, lowerContent, goalContext) {
        const timelinePatterns = [
            /(?:in|within)\s*(\d+)\s*(year|years|month|months)/i,
            /(?:by|before)\s*(\d{4})/i,
            /(?:age|when\s*i'm)\s*(\d+)/i,
            /(\d+)\s*(?:year|years)\s*(?:time|away)/i
        ];

        for (const pattern of timelinePatterns) {
            const match = content.match(pattern);
            if (match) {
                let timeValue = parseInt(match[1]);
                let timeUnit = match[2] ? match[2].toLowerCase() : 'years';

                // Handle year format (e.g., "by 2030")
                if (match[0].includes('by') && timeValue > 2020) {
                    const currentYear = new Date().getFullYear();
                    timeValue = timeValue - currentYear;
                    timeUnit = 'years';
                }

                return {
                    value: timeValue,
                    unit: timeUnit.replace(/s$/, ''), // Remove plural
                    text: match[0],
                    goalContext: goalContext,
                    urgency: this.calculateUrgency(timeValue, timeUnit)
                };
            }
        }

        return null;
    }

    calculateUrgency(value, unit) {
        let months = value;

        if (unit.includes('year')) {
            months = value * 12;
        } else if (unit.includes('week')) {
            months = value / 4;
        } else if (unit.includes('day')) {
            months = value / 30;
        }

        if (months <= 6) return 'urgent';
        if (months <= 24) return 'high';
        if (months <= 60) return 'medium';
        return 'low';
    }

    // Enhanced insights generation with goal context
    generateInsights(extractedData, goalContext = null) {
        if (!extractedData) return [];

        const insights = [];

        // Goal-specific insights
        if (goalContext) {
            const goalInsights = this.generateGoalSpecificInsights(extractedData, goalContext);
            insights.push(...goalInsights);
        }

        // General financial insights
        if (extractedData.income && extractedData.income.length > 0) {
            const totalAnnualIncome = this.calculateTotalAnnualIncome(extractedData.income);
            const taxData = this.calculateTaxImplications(totalAnnualIncome, 'yearly');

            insights.push({
                type: 'income',
                message: `Your total annual income is £${totalAnnualIncome.toLocaleString()}. After tax, you'll have approximately £${taxData.annualNet.toLocaleString()} (£${taxData.monthlyNet.toLocaleString()} monthly).`,
                value: totalAnnualIncome,
                ukContext: taxData
            });
        }

        if (extractedData.expenses && extractedData.expenses.length > 0) {
            const totalMonthlyExpenses = this.calculateTotalMonthlyExpenses(extractedData.expenses);
            insights.push({
                type: 'expenses',
                message: `Your total monthly expenses are approximately £${totalMonthlyExpenses.toLocaleString()}.`,
                value: totalMonthlyExpenses
            });
        }

        // Surplus/deficit analysis
        if (extractedData.income && extractedData.expenses) {
            const monthlyIncome = this.calculateTotalAnnualIncome(extractedData.income) / 12;
            const monthlyExpenses = this.calculateTotalMonthlyExpenses(extractedData.expenses);
            const surplus = monthlyIncome - monthlyExpenses;

            if (surplus > 0) {
                insights.push({
                    type: 'surplus',
                    message: `You have a monthly surplus of £${surplus.toLocaleString()}. This is excellent for achieving your financial goals!`,
                    value: surplus,
                    priority: 'positive'
                });
            } else if (surplus < 0) {
                insights.push({
                    type: 'deficit',
                    message: `Your expenses exceed your income by £${Math.abs(surplus).toLocaleString()} monthly. This needs immediate attention.`,
                    value: surplus,
                    priority: 'urgent'
                });
            }
        }

        if (extractedData.goals && extractedData.goals.length > 0) {
            const goalTypes = extractedData.goals.flatMap(goal => goal.type || []);
            const uniqueGoals = [...new Set(goalTypes)];
            insights.push({
                type: 'goals',
                message: `You have ${uniqueGoals.length} main financial goals: ${uniqueGoals.join(', ')}.`,
                value: uniqueGoals
            });
        }

        if (extractedData.riskTolerance && extractedData.riskTolerance.level !== 'unknown') {
            insights.push({
                type: 'risk',
                message: `Your risk tolerance is ${extractedData.riskTolerance.level}, which helps determine suitable investment strategies.`,
                value: extractedData.riskTolerance.level
            });
        }

        return insights;
    }

    generateGoalSpecificInsights(extractedData, goalContext) {
        const insights = [];

        switch (goalContext) {
            case 'retirement':
                insights.push(...this.generateRetirementInsights(extractedData));
                break;
            case 'house':
                insights.push(...this.generateHouseInsights(extractedData));
                break;
            case 'emergency':
                insights.push(...this.generateEmergencyInsights(extractedData));
                break;
            case 'investment':
                insights.push(...this.generateInvestmentInsights(extractedData));
                break;
            case 'debt':
                insights.push(...this.generateDebtInsights(extractedData));
                break;
            case 'education':
                insights.push(...this.generateEducationInsights(extractedData));
                break;
        }

        return insights;
    }

    generateRetirementInsights(extractedData) {
        const insights = [];

        if (extractedData.income && extractedData.income.length > 0) {
            const annualIncome = this.calculateTotalAnnualIncome(extractedData.income);
            const recommendedPensionContribution = annualIncome * 0.12; // 12% total contribution rule

            insights.push({
                type: 'retirement',
                message: `Based on your income of £${annualIncome.toLocaleString()}, you should aim for total pension contributions of £${recommendedPensionContribution.toLocaleString()} annually (12% rule).`,
                value: recommendedPensionContribution,
                ukContext: {
                    annualAllowance: this.ukFinancialContext.pensionContributions.annualAllowance,
                    taxRelief: 'Available at your marginal tax rate'
                }
            });
        }

        return insights;
    }

    generateHouseInsights(extractedData) {
        const insights = [];

        if (extractedData.income && extractedData.income.length > 0) {
            const annualIncome = this.calculateTotalAnnualIncome(extractedData.income);
            const maxMortgage = annualIncome * 4.5; // Typical UK mortgage multiple
            const recommendedDeposit = maxMortgage * 0.1; // 10% deposit

            insights.push({
                type: 'house',
                message: `Based on your income, you could potentially borrow up to £${maxMortgage.toLocaleString()} for a mortgage. You'd need a deposit of at least £${recommendedDeposit.toLocaleString()} (10%).`,
                value: maxMortgage,
                ukContext: {
                    firstTimeBuyerSchemes: ['Help to Buy ISA', 'Lifetime ISA'],
                    stampDutyThreshold: 250000
                }
            });
        }

        return insights;
    }

    generateEmergencyInsights(extractedData) {
        const insights = [];

        if (extractedData.expenses && extractedData.expenses.length > 0) {
            const monthlyExpenses = this.calculateTotalMonthlyExpenses(extractedData.expenses);
            const emergencyFund3Months = monthlyExpenses * 3;
            const emergencyFund6Months = monthlyExpenses * 6;

            insights.push({
                type: 'emergency',
                message: `For emergency protection, you should save between £${emergencyFund3Months.toLocaleString()} (3 months) and £${emergencyFund6Months.toLocaleString()} (6 months) of expenses.`,
                value: emergencyFund6Months,
                ukContext: {
                    recommendedSavings: 'Easy access savings accounts or Cash ISAs',
                    currentRate: `${this.ukFinancialContext.savingsRates.baseRate}% base rate`
                }
            });
        }

        return insights;
    }

    generateInvestmentInsights(extractedData) {
        const insights = [];

        if (extractedData.income && extractedData.income.length > 0) {
            const annualIncome = this.calculateTotalAnnualIncome(extractedData.income);
            const isaAllowance = this.ukFinancialContext.savingsRates.isaLimit;

            insights.push({
                type: 'investment',
                message: `You can invest up to £${isaAllowance.toLocaleString()} annually in a Stocks & Shares ISA for tax-free growth. This is usually the best starting point for UK investors.`,
                value: isaAllowance,
                ukContext: {
                    taxBenefits: 'No tax on gains or dividends within ISA',
                    annualAllowance: isaAllowance
                }
            });
        }

        return insights;
    }

    generateDebtInsights(extractedData) {
        const insights = [];

        if (extractedData.debts && extractedData.debts.length > 0) {
            const totalDebt = extractedData.debts.reduce((sum, debt) => sum + (debt.amounts?.[0] || 0), 0);

            insights.push({
                type: 'debt',
                message: `You have £${totalDebt.toLocaleString()} in total debt. Focus on paying off high-interest debt first (credit cards, personal loans) before lower-interest debt.`,
                value: totalDebt,
                ukContext: {
                    strategy: 'Avalanche method (highest interest first) or Snowball method (smallest balance first)',
                    freeAdvice: 'Citizens Advice, StepChange, National Debtline'
                }
            });
        }

        return insights;
    }

    generateEducationInsights(extractedData) {
        const insights = [];

        // Estimate university costs
        const currentUniversityCost = 9250 * 3; // £9,250 per year for 3 years
        const accommodationCost = 8000 * 3; // Estimated accommodation per year
        const totalCost = currentUniversityCost + accommodationCost;

        insights.push({
            type: 'education',
            message: `UK university costs are approximately £${totalCost.toLocaleString()} for a 3-year degree (tuition + accommodation). Junior ISAs allow £9,000 annual contributions with tax-free growth.`,
            value: totalCost,
            ukContext: {
                savingOptions: 'Junior ISA, Child Trust Fund, Regular savings accounts',
                timeAdvantage: 'Starting early gives compound growth time to work'
            }
        });

        return insights;
    }

    calculateTotalAnnualIncome(incomeItems) {
        return incomeItems.reduce((total, item) => {
            const amount = item.amounts?.[0] || 0;
            const frequency = item.frequency || 'yearly';

            switch (frequency) {
                case 'weekly':
                    return total + (amount * 52);
                case 'monthly':
                    return total + (amount * 12);
                case 'yearly':
                default:
                    return total + amount;
            }
        }, 0);
    }

    calculateTotalMonthlyExpenses(expenseItems) {
        return expenseItems.reduce((total, item) => {
            const amount = item.amounts?.[0] || 0;
            const frequency = item.frequency || 'monthly';

            switch (frequency) {
                case 'weekly':
                    return total + (amount * 4.33); // Average weeks per month
                case 'yearly':
                    return total + (amount / 12);
                case 'monthly':
                default:
                    return total + amount;
            }
        }, 0);
    }

    // Enhanced calculation methods
    calculateCompletionScore(extractedData, goalContext = null) {
        if (!extractedData) return 0;

        if (goalContext && this.goalRequirements[goalContext]) {
            // Goal-specific completion score
            const requirements = this.goalRequirements[goalContext];
            let totalScore = 0;
            let maxScore = 0;

            [...requirements.critical, ...requirements.important, ...requirements.optional].forEach(field => {
                const weight = requirements.critical.includes(field) ? 40 :
                    requirements.important.includes(field) ? 30 : 20;
                maxScore += weight;

                const data = extractedData[field];
                if (data && (Array.isArray(data) ? data.length > 0 : data !== null)) {
                    totalScore += weight;
                }
            });

            return Math.min(Math.round((totalScore / maxScore) * 100), 100);
        } else {
            // General completion score
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
    }

    // Existing helper methods (kept for compatibility)
    extractAmounts(text) {
        if (!text || typeof text !== 'string') return [];

        const patterns = [
            /£\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g,
            /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:pounds|quid)/g,
            /(\d+)k/g,
            /(\d+)\s*thousand/g,
            /(\d+)\s*million/g,
            /\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g,
            /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars)/g,
            /(\d+(?:,\d{3})*)/g
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

    categorizeExpenseType(expenseDescription) {
        const lower = expenseDescription.toLowerCase();

        if (/beer|alcohol|drinks|entertainment|fun|leisure|movies|cinema|netflix|spotify|subscriptions/.test(lower)) {
            return 'entertainment';
        }
        if (/food|groceries|eating|restaurant|takeaway|coffee|lunch|dinner/.test(lower)) {
            return 'food';
        }
        if (/transport|car|petrol|gas|fuel|bus|train|uber|taxi|parking/.test(lower)) {
            return 'transport';
        }
        if (/utilities|electric|gas|water|internet|phone|mobile/.test(lower)) {
            return 'utilities';
        }
        if (/shopping|clothes|clothing|amazon|retail/.test(lower)) {
            return 'shopping';
        }

        return expenseDescription || 'other expenses';
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

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Enhanced methods for goal-specific data extraction
    extractRiskData(content, lowerContent, goalContext) {
        const riskPatterns = [
            /i\s*am\s*(?:a\s*)?(low|medium|high|conservative|aggressive)\s*risk\s*investor/i,
            /(low|medium|high|conservative|aggressive)\s*risk\s*(?:tolerance|investor|profile)?/i,
            /i\s*am\s*(conservative|aggressive|cautious|careful|adventurous)/i,
            /i\s*prefer\s*(safe|risky|balanced)\s*investments/i,
            /my\s*risk\s*tolerance\s*is\s*(low|medium|high|conservative|aggressive)/i
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
                    rawText: match[0],
                    goalContext: goalContext,
                    investmentSuitability: this.getInvestmentSuitability(level)
                };
            }
        }

        return null;
    }

    extractAssetData(content, lowerContent, goalContext) {
        const assetPatterns = [
            /(?:i\s*have\s*)?savings\s*of\s*([£$]?\s*\d+[k]?)/i,
            /([£$]?\s*\d+[k]?)\s*(?:in\s*)?savings/i,
            /portfolio\s*(?:worth|of)\s*([£$]?\s*\d+[k]?)/i,
            /isa\s*(?:worth|of)\s*([£$]?\s*\d+[k]?)/i,
            /pension\s*pot\s*(?:worth|of)\s*([£$]?\s*\d+[k]?)/i,
            /investments?\s*(?:worth|of)\s*([£$]?\s*\d+[k]?)/i
        ];

        for (const pattern of assetPatterns) {
            const match = content.match(pattern);
            if (match) {
                const amounts = this.extractAmounts(match[0]);
                if (amounts.length > 0) {
                    const amount = amounts[0];
                    let text = '';
                    let assetType = 'savings';

                    if (/savings/i.test(match[0])) {
                        text = `£${amount.toLocaleString()} savings`;
                        assetType = 'savings';
                    } else if (/portfolio/i.test(match[0])) {
                        text = `£${amount.toLocaleString()} investment portfolio`;
                        assetType = 'portfolio';
                    } else if (/isa/i.test(match[0])) {
                        text = `£${amount.toLocaleString()} ISA`;
                        assetType = 'isa';
                    } else if (/pension/i.test(match[0])) {
                        text = `£${amount.toLocaleString()} pension pot`;
                        assetType = 'pension';
                    } else if (/investment/i.test(match[0])) {
                        text = `£${amount.toLocaleString()} investments`;
                        assetType = 'investments';
                    } else {
                        text = `£${amount.toLocaleString()} assets`;
                        assetType = 'general';
                    }

                    return {
                        text: text,
                        amounts: [amount],
                        assetType: assetType,
                        rawText: match[0],
                        goalContext: goalContext,
                        ukContext: this.getAssetUKContext(assetType)
                    };
                }
            }
        }

        return null;
    }

    extractDebtData(content, lowerContent, goalContext) {
        const debtPatterns = [
            /(?:i\s*)?owe\s*([£$]?\s*\d+[k]?)/i,
            /debt\s*of\s*([£$]?\s*\d+[k]?)/i,
            /([£$]?\s*\d+[k]?)\s*(?:in\s*)?debt/i,
            /credit\s*card\s*(?:debt|balance)\s*(?:of\s*)?([£$]?\s*\d+[k]?)/i,
            /loan\s*(?:balance|of)\s*([£$]?\s*\d+[k]?)/i,
            /mortgage\s*(?:balance|of)\s*([£$]?\s*\d+[k]?)/i
        ];

        for (const pattern of debtPatterns) {
            const match = content.match(pattern);
            if (match) {
                const amounts = this.extractAmounts(match[0]);
                if (amounts.length > 0) {
                    const amount = amounts[0];
                    let text = '';
                    let debtType = 'general';

                    if (/credit\s*card/i.test(match[0])) {
                        text = `£${amount.toLocaleString()} credit card debt`;
                        debtType = 'credit_card';
                    } else if (/loan/i.test(match[0])) {
                        text = `£${amount.toLocaleString()} loan`;
                        debtType = 'loan';
                    } else if (/mortgage/i.test(match[0])) {
                        text = `£${amount.toLocaleString()} mortgage balance`;
                        debtType = 'mortgage';
                    } else {
                        text = `£${amount.toLocaleString()} debt`;
                        debtType = 'general';
                    }

                    return {
                        text: text,
                        amounts: [amount],
                        debtType: debtType,
                        rawText: match[0],
                        goalContext: goalContext,
                        priority: this.getDebtPriority(debtType)
                    };
                }
            }
        }

        return null;
    }

    getInvestmentSuitability(riskLevel) {
        const suitability = {
            low: 'Cash ISAs, Premium Bonds, Government bonds',
            medium: 'Balanced funds, Index trackers, Mixed ISAs',
            high: 'Individual stocks, Growth funds, Emerging markets'
        };

        return suitability[riskLevel] || 'Speak to a financial advisor';
    }

    getAssetUKContext(assetType) {
        const context = {
            savings: { protection: 'FSCS protection up to £85,000 per bank' },
            isa: { allowance: this.ukFinancialContext.savingsRates.isaLimit, taxBenefit: 'Tax-free growth' },
            pension: { annualAllowance: this.ukFinancialContext.pensionContributions.annualAllowance },
            portfolio: { capitalGains: 'Annual allowance £3,000' }
        };

        return context[assetType] || {};
    }

    getDebtPriority(debtType) {
        const priorities = {
            credit_card: 'high', // Usually highest interest
            loan: 'medium',
            mortgage: 'low', // Usually lowest interest, tax benefits
            general: 'medium'
        };

        return priorities[debtType] || 'medium';
    }
}

export default new DataExtractionService();