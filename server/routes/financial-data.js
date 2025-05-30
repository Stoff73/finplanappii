// server/routes/financial-data.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all financial data for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const [goals, income, expenses, assets, debts, riskProfile] = await Promise.all([
            prisma.goal.findMany({ where: { userId } }),
            prisma.income.findMany({ where: { userId } }),
            prisma.expense.findMany({ where: { userId } }),
            prisma.asset.findMany({ where: { userId } }),
            prisma.debt.findMany({ where: { userId } }),
            prisma.riskProfile.findUnique({ where: { userId } })
        ]);

        res.json({
            goals: goals.map(goal => ({
                ...goal,
                type: safeJsonParse(goal.type, []),
                amounts: safeJsonParse(goal.amounts, []),
                timeframes: goal.timeframes ? safeJsonParse(goal.timeframes, null) : null
            })),
            income,
            expenses,
            assets,
            debts,
            riskTolerance: riskProfile
        });
    } catch (error) {
        console.error('Error fetching financial data:', error);
        res.status(500).json({ error: 'Failed to fetch financial data' });
    }
});

// Save extracted financial data
router.post('/save', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { extractedData } = req.body;

        console.log('💾 Saving financial data for user:', userId);
        console.log('📊 Extracted data received:', JSON.stringify(extractedData, null, 2));

        // Use transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Clear existing data (optional - you might want to merge instead)
            console.log('🗑️ Clearing existing data...');
            await Promise.all([
                tx.goal.deleteMany({ where: { userId } }),
                tx.income.deleteMany({ where: { userId } }),
                tx.expense.deleteMany({ where: { userId } }),
                tx.asset.deleteMany({ where: { userId } }),
                tx.debt.deleteMany({ where: { userId } }),
                tx.riskProfile.deleteMany({ where: { userId } })
            ]);

            // Save new data using individual create calls (compatible with older Prisma versions)
            const promises = [];

            // Goals
            if (extractedData.goals?.length) {
                for (const goal of extractedData.goals) {
                    promises.push(
                        tx.goal.create({
                            data: {
                                userId,
                                text: goal.text,
                                type: JSON.stringify(goal.type || []),
                                amounts: JSON.stringify(goal.amounts || []),
                                timeframes: goal.timeframes ? JSON.stringify(goal.timeframes) : null,
                                category: goal.category || 'goal'
                            }
                        })
                    );
                }
            }

            // Income
            if (extractedData.income?.length) {
                for (const income of extractedData.income) {
                    console.log('💰 Saving income:', income);
                    promises.push(
                        tx.income.create({
                            data: {
                                userId,
                                text: income.text,
                                amount: income.amounts?.[0] || 0,
                                frequency: income.frequency || 'yearly', // Use extracted frequency, default to yearly for income
                                category: income.category || 'income',
                                source: income.source || null
                            }
                        })
                    );
                }
            }

            // Expenses
            if (extractedData.expenses?.length) {
                for (const expense of extractedData.expenses) {
                    console.log('💸 Saving expense:', expense);
                    promises.push(
                        tx.expense.create({
                            data: {
                                userId,
                                text: expense.text,
                                amount: expense.amounts?.[0] || 0,
                                frequency: expense.frequency || 'monthly', // Use extracted frequency, default to monthly for expenses
                                category: expense.category || 'expense'
                            }
                        })
                    );
                }
            }

            // Assets
            if (extractedData.assets?.length) {
                for (const asset of extractedData.assets) {
                    promises.push(
                        tx.asset.create({
                            data: {
                                userId,
                                text: asset.text,
                                amount: asset.amounts?.[0] || 0,
                                type: asset.type || 'savings'
                            }
                        })
                    );
                }
            }

            // Debts
            if (extractedData.debts?.length) {
                for (const debt of extractedData.debts) {
                    promises.push(
                        tx.debt.create({
                            data: {
                                userId,
                                text: debt.text,
                                amount: debt.amounts?.[0] || 0,
                                type: debt.type || 'other'
                            }
                        })
                    );
                }
            }

            // Risk Profile
            if (extractedData.riskTolerance) {
                promises.push(
                    tx.riskProfile.create({
                        data: {
                            userId,
                            text: extractedData.riskTolerance.text,
                            level: extractedData.riskTolerance.level
                        }
                    })
                );
            }

            await Promise.all(promises);
            console.log('✅ Data saved successfully to database');
            return true;
        });

        // Calculate and update completion score
        const completionScore = calculateCompletionScore(extractedData);
        console.log('📊 Calculated completion score:', completionScore);

        await prisma.user.update({
            where: { id: userId },
            data: {
                completionScore,
                lastActive: new Date()
            }
        });

        res.json({ success: true, completionScore });
    } catch (error) {
        console.error('❌ Error saving financial data:', error);
        res.status(500).json({ error: 'Failed to save financial data' });
    }
});

// Safe JSON parsing helper function
function safeJsonParse(jsonString, defaultValue = null) {
    try {
        return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (error) {
        console.error('JSON parse error:', error);
        return defaultValue;
    }
}

// Calculate completion score (same logic as frontend)
function calculateCompletionScore(extractedData) {
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

module.exports = router;