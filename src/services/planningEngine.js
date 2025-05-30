// src/services/planningEngine.js
// UK Financial Planning Engine - Tax Year 2025/26

class PlanningEngineService {
    constructor() {
        // UK Tax Year 2025/26 Constants
        this.taxYear = '2025/26';
        this.taxBands = {
            personalAllowance: 12570,
            basicRateThreshold: 50270, // Personal allowance + basic rate band
            higherRateThreshold: 125140,
            basicRate: 0.20,
            higherRate: 0.40,
            additionalRate: 0.45
        };

        this.nationalInsurance = {
            primaryThreshold: 12570,
            upperEarningsLimit: 50270,
            class1Rate: 0.12,
            class1UpperRate: 0.02
        };

        this.pensionLimits = {
            annualAllowance: 60000, // 2025/26
            lifetimeAllowance: 1073100, // Abolished but useful for legacy calculations
            minimumAge: 55, // Increasing to 57 in 2028
            statePensionAge: 67 // Current for most people
        };

        this.isaLimits = {
            annual: 20000,
            cashIsa: 20000,
            stocksSharesIsa: 20000,
            lifetimeIsa: 4000,
            lifetimeIsaBonus: 1000,
            lifetimeIsaMaxAge: 39
        };

        this.mortgageRules = {
            maxIncomeMultiple: 4.5,
            minDeposit: 0.05, // 5%
            helpToBuyIsaBonus: 0.25, // 25% government bonus
            sharedOwnershipMinShare: 0.25 // 25%
        };

        this.inflationRates = {
            general: 0.025, // 2.5% assumed long-term inflation
            housing: 0.03,  // 3% house price inflation
            income: 0.025   // 2.5% salary inflation
        };
    }

    // ===========================================
    // INCOME NORMALIZATION AND TAX CALCULATIONS
    // ===========================================

    /**
     * Convert all income to monthly post-tax amounts
     * @param {Array} incomeItems - Array of income objects
     * @returns {Object} Normalized income data
     */
    normalizeIncome(incomeItems) {
        if (!incomeItems || !Array.isArray(incomeItems)) {
            return {
                monthlyGross: 0,
                monthlyNet: 0,
                annualGross: 0,
                annualNet: 0,
                taxBreakdown: {
                    incomeTax: 0,
                    nationalInsurance: 0,
                    totalDeductions: 0
                },
                sources: []
            };
        }

        let totalAnnualGross = 0;
        const sources = [];

        // Process each income source
        incomeItems.forEach(income => {
            const amount = income.amounts?.[0] || 0;
            const frequency = income.frequency || 'yearly';

            // Convert to annual gross
            let annualGross = this.convertToAnnual(amount, frequency);

            // Categorize income type for tax treatment
            const incomeType = this.categorizeIncomeType(income.text, income.category);

            totalAnnualGross += annualGross;

            sources.push({
                description: income.text,
                type: incomeType,
                frequency: frequency,
                grossAmount: amount,
                annualGross: annualGross
            });
        });

        // Calculate tax and NI
        const taxBreakdown = this.calculateTaxAndNI(totalAnnualGross);
        const annualNet = totalAnnualGross - taxBreakdown.totalDeductions;

        return {
            monthlyGross: Math.round(totalAnnualGross / 12),
            monthlyNet: Math.round(annualNet / 12),
            annualGross: totalAnnualGross,
            annualNet: annualNet,
            taxBreakdown: taxBreakdown,
            sources: sources
        };
    }

    /**
     * Convert any frequency to annual amount
     * @param {number} amount 
     * @param {string} frequency 
     * @returns {number} Annual amount
     */
    convertToAnnual(amount, frequency) {
        switch (frequency.toLowerCase()) {
            case 'weekly':
                return amount * 52;
            case 'monthly':
                return amount * 12;
            case 'quarterly':
                return amount * 4;
            case 'yearly':
            case 'annual':
            default:
                return amount;
        }
    }

    /**
     * Convert any frequency to monthly amount
     * @param {number} amount 
     * @param {string} frequency 
     * @returns {number} Monthly amount
     */
    convertToMonthly(amount, frequency) {
        const annual = this.convertToAnnual(amount, frequency);
        return Math.round(annual / 12);
    }

    /**
     * Categorize income type for tax treatment
     * @param {string} description 
     * @param {string} category 
     * @returns {string} Income type
     */
    categorizeIncomeType(description, category) {
        const desc = description.toLowerCase();

        if (desc.includes('salary') || desc.includes('employment') || desc.includes('job')) {
            return 'employment';
        } else if (desc.includes('self-employed') || desc.includes('business') || desc.includes('freelance')) {
            return 'self-employment';
        } else if (desc.includes('pension') || desc.includes('retirement')) {
            return 'pension';
        } else if (desc.includes('rental') || desc.includes('property')) {
            return 'rental';
        } else if (desc.includes('dividend') || desc.includes('investment')) {
            return 'investment';
        } else if (desc.includes('benefit') || desc.includes('allowance')) {
            return 'benefits';
        }

        return 'other';
    }

    /**
     * Calculate UK Income Tax and National Insurance
     * @param {number} annualGross 
     * @returns {Object} Tax breakdown
     */
    calculateTaxAndNI(annualGross) {
        // Income Tax Calculation
        let incomeTax = 0;
        let taxableIncome = Math.max(0, annualGross - this.taxBands.personalAllowance);

        if (taxableIncome > 0) {
            // Basic rate (20%)
            const basicRateTax = Math.min(taxableIncome, this.taxBands.basicRateThreshold - this.taxBands.personalAllowance) * this.taxBands.basicRate;
            incomeTax += basicRateTax;

            // Higher rate (40%)
            if (taxableIncome > this.taxBands.basicRateThreshold - this.taxBands.personalAllowance) {
                const higherRateIncome = Math.min(
                    taxableIncome - (this.taxBands.basicRateThreshold - this.taxBands.personalAllowance),
                    this.taxBands.higherRateThreshold - this.taxBands.basicRateThreshold
                );
                incomeTax += higherRateIncome * this.taxBands.higherRate;
            }

            // Additional rate (45%)
            if (taxableIncome > this.taxBands.higherRateThreshold - this.taxBands.personalAllowance) {
                const additionalRateIncome = taxableIncome - (this.taxBands.higherRateThreshold - this.taxBands.personalAllowance);
                incomeTax += additionalRateIncome * this.taxBands.additionalRate;
            }
        }

        // National Insurance Calculation
        let nationalInsurance = 0;
        if (annualGross > this.nationalInsurance.primaryThreshold) {
            // Main rate (12%)
            const mainRateNI = Math.min(
                annualGross - this.nationalInsurance.primaryThreshold,
                this.nationalInsurance.upperEarningsLimit - this.nationalInsurance.primaryThreshold
            ) * this.nationalInsurance.class1Rate;
            nationalInsurance += mainRateNI;

            // Upper rate (2%)
            if (annualGross > this.nationalInsurance.upperEarningsLimit) {
                const upperRateNI = (annualGross - this.nationalInsurance.upperEarningsLimit) * this.nationalInsurance.class1UpperRate;
                nationalInsurance += upperRateNI;
            }
        }

        return {
            incomeTax: Math.round(incomeTax),
            nationalInsurance: Math.round(nationalInsurance),
            totalDeductions: Math.round(incomeTax + nationalInsurance),
            effectiveRate: annualGross > 0 ? Math.round(((incomeTax + nationalInsurance) / annualGross) * 100) : 0
        };
    }

    // ===========================================
    // EXPENSE NORMALIZATION
    // ===========================================

    /**
     * Normalize all expenses to monthly amounts
     * @param {Array} expenseItems 
     * @returns {Object} Normalized expense data
     */
    normalizeExpenses(expenseItems) {
        if (!expenseItems || !Array.isArray(expenseItems)) {
            return {
                monthlyTotal: 0,
                annualTotal: 0,
                categories: {},
                breakdown: []
            };
        }

        const categories = {};
        const breakdown = [];
        let monthlyTotal = 0;

        expenseItems.forEach(expense => {
            const amount = expense.amounts?.[0] || 0;
            const frequency = expense.frequency || 'monthly';
            const category = this.categorizeExpenseType(expense.text, expense.category);

            const monthlyAmount = this.convertToMonthly(amount, frequency);
            monthlyTotal += monthlyAmount;

            if (!categories[category]) {
                categories[category] = 0;
            }
            categories[category] += monthlyAmount;

            breakdown.push({
                description: expense.text,
                category: category,
                frequency: frequency,
                originalAmount: amount,
                monthlyAmount: monthlyAmount
            });
        });

        return {
            monthlyTotal: Math.round(monthlyTotal),
            annualTotal: Math.round(monthlyTotal * 12),
            categories: categories,
            breakdown: breakdown
        };
    }

    /**
     * Categorize expense types
     * @param {string} description 
     * @param {string} category 
     * @returns {string} Expense category
     */
    categorizeExpenseType(description, category) {
        const desc = description.toLowerCase();

        if (desc.includes('rent') || desc.includes('mortgage') || desc.includes('housing')) {
            return 'housing';
        } else if (desc.includes('food') || desc.includes('groceries') || desc.includes('eating')) {
            return 'food';
        } else if (desc.includes('transport') || desc.includes('car') || desc.includes('petrol') || desc.includes('travel')) {
            return 'transport';
        } else if (desc.includes('utilities') || desc.includes('electric') || desc.includes('gas') || desc.includes('water')) {
            return 'utilities';
        } else if (desc.includes('insurance') || desc.includes('protection')) {
            return 'insurance';
        } else if (desc.includes('entertainment') || desc.includes('leisure') || desc.includes('subscription')) {
            return 'entertainment';
        } else if (desc.includes('health') || desc.includes('medical') || desc.includes('dental')) {
            return 'healthcare';
        }

        return category || 'other';
    }

    // ===========================================
    // GOAL-SPECIFIC PLANNING CALCULATIONS
    // ===========================================

    /**
     * Calculate retirement planning projections
     * @param {Object} financialData 
     * @returns {Object} Retirement plan
     */
    calculateRetirementPlan(financialData) {
        const income = this.normalizeIncome(financialData.income);
        const expenses = this.normalizeExpenses(financialData.expenses);

        // Extract retirement goals
        const retirementGoals = financialData.goals?.filter(goal =>
            goal.type?.includes('retirement') || goal.text.toLowerCase().includes('retire')
        ) || [];

        const targetRetirementAge = this.extractRetirementAge(retirementGoals) || 67;
        const currentAge = 35; // TODO: Extract from user data
        const yearsToRetirement = Math.max(0, targetRetirementAge - currentAge);

        // Calculate required retirement income (typically 60-80% of current income)
        const targetIncomeReplacement = 0.7; // 70%
        const requiredAnnualIncome = income.annualNet * targetIncomeReplacement;
        const requiredMonthlyIncome = Math.round(requiredAnnualIncome / 12);

        // Calculate state pension estimate
        const statePensionAnnual = 11502; // 2025/26 full state pension
        const privateIncomeRequired = Math.max(0, requiredAnnualIncome - statePensionAnnual);

        // Calculate pension pot required (using 4% withdrawal rule)
        const withdrawalRate = 0.04;
        const pensionPotRequired = Math.round(privateIncomeRequired / withdrawalRate);

        // Current pension analysis
        const currentPensionValue = this.extractPensionValue(financialData.assets) || 0;
        const pensionGap = Math.max(0, pensionPotRequired - currentPensionValue);

        // Monthly contribution needed
        const annualReturn = 0.05; // 5% assumed annual return
        const monthlyContributionNeeded = this.calculateMonthlyContribution(
            pensionGap,
            yearsToRetirement,
            annualReturn
        );

        // Affordability analysis
        const currentSurplus = income.monthlyNet - expenses.monthlyTotal;
        const affordabilityRatio = currentSurplus > 0 ? monthlyContributionNeeded / currentSurplus : 0;

        return {
            summary: {
                targetRetirementAge,
                yearsToRetirement,
                requiredMonthlyIncome,
                requiredAnnualIncome,
                pensionPotRequired,
                currentPensionValue,
                pensionGap,
                monthlyContributionNeeded
            },
            statePension: {
                annualAmount: statePensionAnnual,
                monthlyAmount: Math.round(statePensionAnnual / 12),
                eligibilityAge: this.pensionLimits.statePensionAge
            },
            affordability: {
                currentSurplus,
                contributionAffordable: monthlyContributionNeeded <= currentSurplus,
                affordabilityRatio: Math.round(affordabilityRatio * 100),
                recommendedContribution: Math.min(monthlyContributionNeeded, currentSurplus * 0.8)
            },
            projections: this.calculateRetirementProjections(
                currentPensionValue,
                Math.min(monthlyContributionNeeded, currentSurplus * 0.8),
                yearsToRetirement,
                annualReturn
            )
        };
    }

    /**
     * Calculate house purchase planning
     * @param {Object} financialData 
     * @returns {Object} House purchase plan
     */
    calculateHousePurchasePlan(financialData) {
        const income = this.normalizeIncome(financialData.income);
        const expenses = this.normalizeExpenses(financialData.expenses);

        // Extract house purchase goals
        const houseGoals = financialData.goals?.filter(goal =>
            goal.type?.includes('house') || goal.text.toLowerCase().includes('house')
        ) || [];

        const targetHousePrice = this.extractTargetAmount(houseGoals) || 300000; // Default £300k
        const timeframe = this.extractTimeframe(houseGoals) || 5; // Default 5 years

        // Mortgage affordability
        const maxMortgage = income.annualGross * this.mortgageRules.maxIncomeMultiple;
        const maxAffordablePrice = maxMortgage / (1 - this.mortgageRules.minDeposit);

        // Deposit calculations
        const minDeposit = targetHousePrice * this.mortgageRules.minDeposit;
        const recommendedDeposit = targetHousePrice * 0.15; // 15% to avoid higher LTV rates
        const optimalDeposit = targetHousePrice * 0.20; // 20% for best rates

        // Current savings towards house
        const currentSavings = this.extractHouseSavings(financialData.assets) || 0;
        const depositGap = Math.max(0, recommendedDeposit - currentSavings);

        // Monthly savings required
        const monthlyContributionNeeded = Math.round(depositGap / (timeframe * 12));

        // Affordability analysis
        const currentSurplus = income.monthlyNet - expenses.monthlyTotal;
        const savingsAffordable = monthlyContributionNeeded <= currentSurplus;

        // Additional costs
        const stampDuty = this.calculateStampDuty(targetHousePrice, false); // Assume first-time buyer
        const legalFees = 2000;
        const surveyFees = 800;
        const movingCosts = 2000;
        const totalAdditionalCosts = stampDuty + legalFees + surveyFees + movingCosts;

        return {
            summary: {
                targetHousePrice,
                timeframe,
                maxAffordablePrice,
                mortgageCapacity: maxMortgage,
                depositRequired: recommendedDeposit,
                depositGap,
                monthlyContributionNeeded,
                totalCostWithFees: targetHousePrice + totalAdditionalCosts
            },
            deposits: {
                minimum: minDeposit,
                recommended: recommendedDeposit,
                optimal: optimalDeposit,
                current: currentSavings
            },
            affordability: {
                priceAffordable: targetHousePrice <= maxAffordablePrice,
                savingsAffordable,
                currentSurplus,
                surplusAfterSaving: currentSurplus - monthlyContributionNeeded
            },
            additionalCosts: {
                stampDuty,
                legalFees,
                surveyFees,
                movingCosts,
                total: totalAdditionalCosts
            },
            recommendations: this.generateHousePurchaseRecommendations(
                targetHousePrice,
                maxAffordablePrice,
                savingsAffordable,
                monthlyContributionNeeded
            )
        };
    }

    /**
     * Calculate investment planning strategy
     * @param {Object} financialData 
     * @returns {Object} Investment plan
     */
    calculateInvestmentPlan(financialData) {
        const income = this.normalizeIncome(financialData.income);
        const expenses = this.normalizeExpenses(financialData.expenses);
        const riskTolerance = financialData.riskTolerance?.level || 'medium';

        // Investment capacity
        const monthlySurplus = income.monthlyNet - expenses.monthlyTotal;
        const emergencyFundNeeded = expenses.monthlyTotal * 6; // 6 months emergency fund
        const currentSavings = this.extractTotalSavings(financialData.assets) || 0;

        const emergencyFundGap = Math.max(0, emergencyFundNeeded - currentSavings);
        const monthlyInvestmentCapacity = Math.max(0, monthlySurplus - (emergencyFundGap > 0 ? 500 : 0));

        // Risk-based asset allocation
        const assetAllocation = this.getAssetAllocation(riskTolerance);

        // ISA utilization
        const annualInvestmentCapacity = monthlyInvestmentCapacity * 12;
        const isaRecommendation = Math.min(annualInvestmentCapacity, this.isaLimits.annual);

        return {
            summary: {
                monthlyInvestmentCapacity,
                annualInvestmentCapacity,
                riskTolerance,
                emergencyFundStatus: emergencyFundGap === 0 ? 'Complete' : 'Needed',
                emergencyFundGap
            },
            assetAllocation,
            isaStrategy: {
                annualAllowance: this.isaLimits.annual,
                recommendedContribution: isaRecommendation,
                utilizationRate: Math.round((isaRecommendation / this.isaLimits.annual) * 100)
            },
            projections: this.calculateInvestmentProjections(
                monthlyInvestmentCapacity,
                assetAllocation.expectedReturn,
                [5, 10, 15, 20]
            )
        };
    }

    // ===========================================
    // HELPER CALCULATION METHODS
    // ===========================================

    /**
     * Calculate monthly contribution needed for future value
     * @param {number} futureValue 
     * @param {number} years 
     * @param {number} annualReturn 
     * @returns {number} Monthly contribution
     */
    calculateMonthlyContribution(futureValue, years, annualReturn) {
        if (years <= 0) return 0;

        const monthlyRate = annualReturn / 12;
        const numPayments = years * 12;

        if (monthlyRate === 0) {
            return Math.round(futureValue / numPayments);
        }

        const monthlyContribution = futureValue * monthlyRate /
            (Math.pow(1 + monthlyRate, numPayments) - 1);

        return Math.round(monthlyContribution);
    }

    /**
     * Calculate stamp duty for property purchase
     * @param {number} propertyValue 
     * @param {boolean} isFirstTimeBuyer 
     * @returns {number} Stamp duty amount
     */
    calculateStampDuty(propertyValue, isFirstTimeBuyer = true) {
        if (isFirstTimeBuyer && propertyValue <= 625000) {
            if (propertyValue <= 425000) return 0;
            return (propertyValue - 425000) * 0.05;
        }

        let stampDuty = 0;
        if (propertyValue > 250000) {
            stampDuty += Math.min(propertyValue - 250000, 675000) * 0.05;
        }
        if (propertyValue > 925000) {
            stampDuty += Math.min(propertyValue - 925000, 575000) * 0.10;
        }
        if (propertyValue > 1500000) {
            stampDuty += (propertyValue - 1500000) * 0.12;
        }

        return Math.round(stampDuty);
    }

    /**
     * Get risk-based asset allocation
     * @param {string} riskLevel 
     * @returns {Object} Asset allocation
     */
    getAssetAllocation(riskLevel) {
        switch (riskLevel.toLowerCase()) {
            case 'low':
                return {
                    cash: 20,
                    bonds: 60,
                    equities: 20,
                    alternatives: 0,
                    expectedReturn: 0.04 // 4%
                };
            case 'medium':
                return {
                    cash: 10,
                    bonds: 40,
                    equities: 45,
                    alternatives: 5,
                    expectedReturn: 0.06 // 6%
                };
            case 'high':
                return {
                    cash: 5,
                    bonds: 20,
                    equities: 65,
                    alternatives: 10,
                    expectedReturn: 0.08 // 8%
                };
            default:
                return this.getAssetAllocation('medium');
        }
    }

    // ===========================================
    // DATA EXTRACTION HELPERS
    // ===========================================

    extractRetirementAge(goals) {
        for (const goal of goals) {
            const ageMatch = goal.text.match(/retire\s*(?:at|by)\s*(\d+)/i);
            if (ageMatch) return parseInt(ageMatch[1]);

            if (goal.timeframes) {
                const timeframe = goal.timeframes[0];
                if (timeframe && timeframe.unit === 'years') {
                    return 35 + timeframe.value; // Assume current age 35
                }
            }
        }
        return null;
    }

    extractTargetAmount(goals) {
        for (const goal of goals) {
            if (goal.amounts && goal.amounts.length > 0) {
                return goal.amounts[0];
            }
        }
        return null;
    }

    extractTimeframe(goals) {
        for (const goal of goals) {
            if (goal.timeframes && goal.timeframes.length > 0) {
                const timeframe = goal.timeframes[0];
                if (timeframe.unit === 'years') return timeframe.value;
                if (timeframe.unit === 'months') return Math.round(timeframe.value / 12);
            }
        }
        return null;
    }

    extractPensionValue(assets) {
        if (!assets) return 0;
        return assets
            .filter(asset => asset.text.toLowerCase().includes('pension'))
            .reduce((sum, asset) => sum + (asset.amounts?.[0] || 0), 0);
    }

    extractHouseSavings(assets) {
        if (!assets) return 0;
        return assets
            .filter(asset =>
                asset.text.toLowerCase().includes('house') ||
                asset.text.toLowerCase().includes('deposit') ||
                asset.text.toLowerCase().includes('property')
            )
            .reduce((sum, asset) => sum + (asset.amounts?.[0] || 0), 0);
    }

    extractTotalSavings(assets) {
        if (!assets) return 0;
        return assets.reduce((sum, asset) => sum + (asset.amounts?.[0] || 0), 0);
    }

    // ===========================================
    // PROJECTION CALCULATIONS
    // ===========================================

    calculateRetirementProjections(currentValue, monthlyContribution, years, annualReturn) {
        const monthlyRate = annualReturn / 12;
        const numPayments = years * 12;

        // Future value of current savings
        const futureValueCurrent = currentValue * Math.pow(1 + annualReturn, years);

        // Future value of monthly contributions
        let futureValueContributions = 0;
        if (monthlyContribution > 0 && monthlyRate > 0) {
            futureValueContributions = monthlyContribution *
                (Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate;
        } else if (monthlyContribution > 0) {
            futureValueContributions = monthlyContribution * numPayments;
        }

        const totalFutureValue = futureValueCurrent + futureValueContributions;
        const monthlyRetirementIncome = (totalFutureValue * 0.04) / 12; // 4% withdrawal rule

        return {
            projectedPensionPot: Math.round(totalFutureValue),
            monthlyRetirementIncome: Math.round(monthlyRetirementIncome),
            totalContributions: monthlyContribution * numPayments,
            investmentGrowth: Math.round(totalFutureValue - currentValue - (monthlyContribution * numPayments))
        };
    }

    calculateInvestmentProjections(monthlyInvestment, expectedReturn, timeframes) {
        return timeframes.map(years => {
            const monthlyRate = expectedReturn / 12;
            const numPayments = years * 12;

            let futureValue = 0;
            if (monthlyInvestment > 0 && monthlyRate > 0) {
                futureValue = monthlyInvestment *
                    (Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate;
            } else if (monthlyInvestment > 0) {
                futureValue = monthlyInvestment * numPayments;
            }

            const totalContributions = monthlyInvestment * numPayments;
            const investmentGrowth = futureValue - totalContributions;

            return {
                years,
                projectedValue: Math.round(futureValue),
                totalContributions,
                investmentGrowth: Math.round(investmentGrowth),
                returnMultiple: totalContributions > 0 ? Math.round((futureValue / totalContributions) * 100) / 100 : 0
            };
        });
    }

    // ===========================================
    // RECOMMENDATION GENERATORS
    // ===========================================

    generateHousePurchaseRecommendations(targetPrice, maxAffordable, savingsAffordable, monthlyRequired) {
        const recommendations = [];

        if (targetPrice > maxAffordable) {
            recommendations.push({
                type: 'affordability',
                priority: 'high',
                message: `Your target house price (£${targetPrice.toLocaleString()}) exceeds your borrowing capacity (£${maxAffordable.toLocaleString()}). Consider reducing your target price or increasing your income.`
            });
        }

        if (!savingsAffordable) {
            recommendations.push({
                type: 'savings',
                priority: 'high',
                message: `You need to save £${monthlyRequired.toLocaleString()} per month for your deposit, but your current surplus doesn't cover this. Review your expenses or extend your timeframe.`
            });
        }

        if (targetPrice <= maxAffordable && savingsAffordable) {
            recommendations.push({
                type: 'strategy',
                priority: 'medium',
                message: 'Consider opening a Lifetime ISA to get a 25% government bonus on your house deposit savings (up to £1,000 per year).'
            });
        }

        return recommendations;
    }

    // ===========================================
    // VALIDATION AND ERROR HANDLING
    // ===========================================

    validateFinancialData(financialData) {
        const errors = [];

        if (!financialData.income || financialData.income.length === 0) {
            errors.push('Income information is required for financial planning');
        }

        if (!financialData.expenses || financialData.expenses.length === 0) {
            errors.push('Expense information is required for financial planning');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // ===========================================
    // MAIN PLANNING ENGINE ENTRY POINT
    // ===========================================

    /**
    /**
     * Generate comprehensive financial plan based on goal type
     * @param {string} goalType 
     * @param {Object} financialData 
     * @returns {Object} Complete financial plan
     */
    generateFinancialPlan(goalType, financialData) {
        console.log('🔧 Planning Engine: Generating plan for', goalType);

        // Validate input data
        const validation = this.validateFinancialData(financialData);
        if (!validation.isValid) {
            return {
                success: false,
                errors: validation.errors,
                plan: null
            };
        }

        // Normalize core financial data
        const normalizedIncome = this.normalizeIncome(financialData.income);
        const normalizedExpenses = this.normalizeExpenses(financialData.expenses);

        // Calculate basic financial health metrics
        const financialHealth = this.calculateFinancialHealth(normalizedIncome, normalizedExpenses);

        // Generate goal-specific plan
        let goalSpecificPlan = {};

        switch (goalType) {
            case 'retirement':
                goalSpecificPlan = this.calculateRetirementPlan(financialData);
                break;
            case 'saving':
                goalSpecificPlan = this.calculateHousePurchasePlan(financialData);
                break;
            case 'investment':
                goalSpecificPlan = this.calculateInvestmentPlan(financialData);
                break;
            case 'protection':
                goalSpecificPlan = this.calculateProtectionNeeds(financialData);
                break;
            case 'comprehensive':
                goalSpecificPlan = this.calculateComprehensivePlan(financialData);
                break;
            default:
                goalSpecificPlan = this.calculateBasicPlan(financialData);
        }

        // Generate insights and recommendations
        const insights = this.generateKeyInsights(goalType, normalizedIncome, normalizedExpenses, goalSpecificPlan);
        const actionItems = this.generateActionItems(goalType, goalSpecificPlan, financialHealth);

        return {
            success: true,
            plan: {
                goalType,
                generatedAt: new Date().toISOString(),
                taxYear: this.taxYear,
                normalizedIncome,
                normalizedExpenses,
                financialHealth,
                goalSpecificPlan,
                insights,
                actionItems,
                nextReviewDate: this.calculateNextReviewDate()
            }
        };
    }

    /**
     * Calculate overall financial health score
     * @param {Object} income 
     * @param {Object} expenses 
     * @returns {Object} Financial health metrics
     */
    calculateFinancialHealth(income, expenses) {
        const monthlySurplus = income.monthlyNet - expenses.monthlyTotal;
        const savingsRate = income.monthlyNet > 0 ? (monthlySurplus / income.monthlyNet) : 0;
        const debtToIncomeRatio = 0; // TODO: Calculate from debt data

        // Calculate financial health score (0-100)
        let healthScore = 0;

        // Surplus component (0-40 points)
        if (monthlySurplus > 0) {
            healthScore += Math.min(40, (savingsRate * 100));
        }

        // Emergency fund component (0-30 points)
        const emergencyFundMonths = 0; // TODO: Calculate from savings data
        healthScore += Math.min(30, emergencyFundMonths * 5);

        // Debt component (0-30 points)
        if (debtToIncomeRatio < 0.2) {
            healthScore += 30;
        } else if (debtToIncomeRatio < 0.4) {
            healthScore += 15;
        }

        return {
            score: Math.round(healthScore),
            monthlySurplus,
            savingsRate: Math.round(savingsRate * 100),
            debtToIncomeRatio: Math.round(debtToIncomeRatio * 100),
            status: healthScore >= 80 ? 'Excellent' :
                healthScore >= 60 ? 'Good' :
                    healthScore >= 40 ? 'Fair' : 'Needs Improvement'
        };
    }

    /**
     * Calculate protection needs analysis
     * @param {Object} financialData 
     * @returns {Object} Protection plan
     */
    calculateProtectionNeeds(financialData) {
        const income = this.normalizeIncome(financialData.income);
        const expenses = this.normalizeExpenses(financialData.expenses);

        // Life insurance needs (typically 10x annual salary)
        const lifeInsuranceNeeded = income.annualGross * 10;

        // Income protection (typically 60-70% of gross income)
        const incomeProtectionNeeded = Math.round(income.monthlyGross * 0.65);

        // Critical illness cover (typically 3-5x annual salary)
        const criticalIllnessNeeded = income.annualGross * 4;

        // Calculate premiums (rough estimates)
        const estimatedPremiums = this.estimateInsurancePremiums(
            lifeInsuranceNeeded,
            incomeProtectionNeeded,
            criticalIllnessNeeded,
            35 // Assumed age
        );

        return {
            summary: {
                lifeInsuranceNeeded,
                incomeProtectionNeeded,
                criticalIllnessNeeded,
                totalMonthlyPremiums: estimatedPremiums.total
            },
            lifeInsurance: {
                recommended: lifeInsuranceNeeded,
                rationale: 'Based on 10x annual gross income to cover family needs and debts',
                estimatedPremium: estimatedPremiums.life
            },
            incomeProtection: {
                recommended: incomeProtectionNeeded,
                rationale: '65% of gross income to maintain lifestyle if unable to work',
                estimatedPremium: estimatedPremiums.income
            },
            criticalIllness: {
                recommended: criticalIllnessNeeded,
                rationale: '4x annual income to cover treatment costs and lifestyle changes',
                estimatedPremium: estimatedPremiums.critical
            },
            affordability: {
                totalPremiums: estimatedPremiums.total,
                asPercentageOfIncome: Math.round((estimatedPremiums.total / income.monthlyNet) * 100),
                affordable: estimatedPremiums.total <= income.monthlyNet * 0.1 // Should be under 10% of net income
            }
        };
    }

    /**
     * Calculate comprehensive financial plan
     * @param {Object} financialData 
     * @returns {Object} Comprehensive plan
     */
    calculateComprehensivePlan(financialData) {
        return {
            retirement: this.calculateRetirementPlan(financialData),
            housePurchase: this.calculateHousePurchasePlan(financialData),
            investment: this.calculateInvestmentPlan(financialData),
            protection: this.calculateProtectionNeeds(financialData),
            priority: this.calculatePriorityOrder(financialData)
        };
    }

    /**
     * Calculate basic financial plan for undefined goals
     * @param {Object} financialData 
     * @returns {Object} Basic plan
     */
    calculateBasicPlan(financialData) {
        const income = this.normalizeIncome(financialData.income);
        const expenses = this.normalizeExpenses(financialData.expenses);
        const monthlySurplus = income.monthlyNet - expenses.monthlyTotal;

        return {
            summary: {
                monthlyIncome: income.monthlyNet,
                monthlyExpenses: expenses.monthlyTotal,
                monthlySurplus,
                savingsRate: income.monthlyNet > 0 ? Math.round((monthlySurplus / income.monthlyNet) * 100) : 0
            },
            recommendations: [
                'Build an emergency fund of 3-6 months expenses',
                'Consider your retirement planning options',
                'Review your insurance needs',
                'Explore investment opportunities for long-term growth'
            ]
        };
    }

    /**
     * Estimate insurance premiums
     * @param {number} lifeInsurance 
     * @param {number} incomeProtection 
     * @param {number} criticalIllness 
     * @param {number} age 
     * @returns {Object} Premium estimates
     */
    estimateInsurancePremiums(lifeInsurance, incomeProtection, criticalIllness, age) {
        // Rough premium calculations based on age and cover amounts
        const lifeRate = age < 30 ? 0.0002 : age < 40 ? 0.0003 : 0.0005;
        const incomeRate = age < 30 ? 0.02 : age < 40 ? 0.025 : 0.03;
        const criticalRate = age < 30 ? 0.0003 : age < 40 ? 0.0005 : 0.0008;

        const lifePremium = Math.round((lifeInsurance * lifeRate) / 12);
        const incomePremium = Math.round(incomeProtection * incomeRate);
        const criticalPremium = Math.round((criticalIllness * criticalRate) / 12);

        return {
            life: lifePremium,
            income: incomePremium,
            critical: criticalPremium,
            total: lifePremium + incomePremium + criticalPremium
        };
    }

    /**
     * Calculate priority order for comprehensive planning
     * @param {Object} financialData 
     * @returns {Array} Prioritized action items
     */
    calculatePriorityOrder(financialData) {
        const income = this.normalizeIncome(financialData.income);
        const expenses = this.normalizeExpenses(financialData.expenses);
        const surplus = income.monthlyNet - expenses.monthlyTotal;

        const priorities = [];

        // Emergency fund (highest priority if not exists)
        const emergencyFundExists = false; // TODO: Check savings data
        if (!emergencyFundExists) {
            priorities.push({
                priority: 1,
                action: 'Build Emergency Fund',
                description: 'Save 3-6 months of expenses for financial security',
                targetAmount: expenses.monthlyTotal * 6,
                urgency: 'High'
            });
        }

        // Employer pension matching (free money)
        priorities.push({
            priority: 2,
            action: 'Maximize Employer Pension',
            description: 'Contribute enough to get full employer matching',
            targetAmount: income.monthlyGross * 0.05, // Assume 5% matching
            urgency: 'High'
        });

        // High-interest debt repayment
        priorities.push({
            priority: 3,
            action: 'Pay High-Interest Debt',
            description: 'Clear credit cards and high-interest loans',
            targetAmount: 0, // TODO: Calculate from debt data
            urgency: 'High'
        });

        // Protection insurance
        priorities.push({
            priority: 4,
            action: 'Arrange Protection Insurance',
            description: 'Life, income protection, and critical illness cover',
            targetAmount: income.monthlyNet * 0.1, // 10% of net income
            urgency: 'Medium'
        });

        // Additional pension contributions
        priorities.push({
            priority: 5,
            action: 'Increase Pension Contributions',
            description: 'Additional contributions for retirement planning',
            targetAmount: surplus * 0.3, // 30% of surplus
            urgency: 'Medium'
        });

        return priorities.filter(p => p.targetAmount > 0).slice(0, 5);
    }

    /**
     * Generate key insights based on plan
     * @param {string} goalType 
     * @param {Object} income 
     * @param {Object} expenses 
     * @param {Object} plan 
     * @returns {Array} Key insights
     */
    generateKeyInsights(goalType, income, expenses, plan) {
        const insights = [];
        const surplus = income.monthlyNet - expenses.monthlyTotal;
        const savingsRate = income.monthlyNet > 0 ? (surplus / income.monthlyNet) : 0;

        // General financial insights
        if (savingsRate > 0.2) {
            insights.push({
                type: 'positive',
                category: 'savings',
                message: `Excellent savings rate of ${Math.round(savingsRate * 100)}%! This puts you in a strong position to achieve your financial goals.`
            });
        } else if (savingsRate < 0.1 && surplus > 0) {
            insights.push({
                type: 'warning',
                category: 'savings',
                message: `Your savings rate of ${Math.round(savingsRate * 100)}% is below the recommended 10-20%. Consider reviewing your expenses.`
            });
        } else if (surplus <= 0) {
            insights.push({
                type: 'alert',
                category: 'budget',
                message: 'Your expenses meet or exceed your income. Budget review is essential before pursuing financial goals.'
            });
        }

        // Tax efficiency insight
        if (income.taxBreakdown.effectiveRate > 20) {
            insights.push({
                type: 'opportunity',
                category: 'tax',
                message: `With an effective tax rate of ${income.taxBreakdown.effectiveRate}%, consider pension contributions and ISAs for tax efficiency.`
            });
        }

        // Goal-specific insights
        if (goalType === 'retirement' && plan.summary) {
            if (plan.affordability.contributionAffordable) {
                insights.push({
                    type: 'positive',
                    category: 'retirement',
                    message: `Good news! Your required pension contribution of £${plan.summary.monthlyContributionNeeded.toLocaleString()} per month is affordable.`
                });
            } else {
                insights.push({
                    type: 'warning',
                    category: 'retirement',
                    message: `Your retirement plan requires £${plan.summary.monthlyContributionNeeded.toLocaleString()} monthly, but you only have £${surplus.toLocaleString()} surplus. Consider extending your timeline or reducing expenses.`
                });
            }
        }

        return insights;
    }

    /**
     * Generate actionable items
     * @param {string} goalType 
     * @param {Object} plan 
     * @param {Object} financialHealth 
     * @returns {Array} Action items
     */
    generateActionItems(goalType, plan, financialHealth) {
        const actions = [];

        // Universal actions
        if (financialHealth.score < 60) {
            actions.push({
                priority: 'high',
                category: 'foundation',
                action: 'Improve Financial Foundation',
                description: 'Focus on increasing income or reducing expenses to improve your financial health score',
                timeframe: '1-3 months'
            });
        }

        // Goal-specific actions
        switch (goalType) {
            case 'retirement':
                if (plan.summary) {
                    actions.push({
                        priority: 'high',
                        category: 'retirement',
                        action: 'Set Up Pension Contributions',
                        description: `Arrange monthly pension contributions of £${plan.summary.monthlyContributionNeeded.toLocaleString()}`,
                        timeframe: '1 month'
                    });

                    actions.push({
                        priority: 'medium',
                        category: 'retirement',
                        action: 'Review State Pension Forecast',
                        description: 'Check your state pension forecast on gov.uk to understand your entitlement',
                        timeframe: '1 week'
                    });
                }
                break;

            case 'saving':
                if (plan.summary) {
                    actions.push({
                        priority: 'high',
                        category: 'saving',
                        action: 'Open Savings Account',
                        description: `Set up automatic savings of £${plan.summary.monthlyContributionNeeded.toLocaleString()} for your house deposit`,
                        timeframe: '1 week'
                    });

                    if (plan.summary.targetHousePrice <= 450000) {
                        actions.push({
                            priority: 'medium',
                            category: 'saving',
                            action: 'Open Lifetime ISA',
                            description: 'Get 25% government bonus on savings up to £4,000 per year',
                            timeframe: '1 week'
                        });
                    }
                }
                break;

            case 'investment':
                actions.push({
                    priority: 'high',
                    category: 'investment',
                    action: 'Open Investment ISA',
                    description: 'Start tax-efficient investing within your £20,000 annual ISA allowance',
                    timeframe: '1 week'
                });
                break;
        }

        return actions;
    }

    /**
     * Calculate next review date
     * @returns {string} ISO date string
     */
    calculateNextReviewDate() {
        const nextReview = new Date();
        nextReview.setMonth(nextReview.getMonth() + 6); // 6 months from now
        return nextReview.toISOString();
    }

    /**
     * Format currency for display
     * @param {number} amount 
     * @returns {string} Formatted currency
     */
    formatCurrency(amount) {
        return `£${amount.toLocaleString()}`;
    }

    /**
     * Get planning engine status and metadata
     * @returns {Object} Engine status
     */
    getEngineStatus() {
        return {
            version: '1.0.0',
            taxYear: this.taxYear,
            lastUpdated: '2025-01-01',
            supportedGoals: ['retirement', 'saving', 'investment', 'protection', 'comprehensive'],
            features: [
                'UK Tax Calculations (2025/26)',
                'Income Normalization',
                'Goal-Specific Planning',
                'Risk-Based Asset Allocation',
                'Protection Needs Analysis',
                'Comprehensive Financial Planning'
            ]
        };
    }
}

export default new PlanningEngineService();