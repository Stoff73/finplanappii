// server/routes/goals.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Create a new user goal
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { goalType, goalLabel } = req.body;

        console.log('🎯 Creating user goal:', { userId, goalType, goalLabel });

        // Check if user already has this goal type
        const existingGoal = await prisma.userGoal.findFirst({
            where: {
                userId,
                goalType
            }
        });

        let userGoal;
        if (existingGoal) {
            // Update existing goal to be current
            await prisma.userGoal.updateMany({
                where: { userId },
                data: { isCurrentGoal: false }
            });

            userGoal = await prisma.userGoal.update({
                where: { id: existingGoal.id },
                data: {
                    goalLabel,
                    isCurrentGoal: true,
                    status: 'active',
                    updatedAt: new Date()
                }
            });
        } else {
            // Set all other goals as not current
            await prisma.userGoal.updateMany({
                where: { userId },
                data: { isCurrentGoal: false }
            });

            // Create new goal
            userGoal = await prisma.userGoal.create({
                data: {
                    userId,
                    goalType,
                    goalLabel,
                    isCurrentGoal: true,
                    status: 'active'
                }
            });

            // Initialize goal progress tracking
            const progressTypes = getProgressTypesForGoal(goalType);
            await Promise.all(
                progressTypes.map(progressType =>
                    prisma.goalProgress.create({
                        data: {
                            userId,
                            userGoalId: userGoal.id,
                            progressType
                        }
                    })
                )
            );
        }

        res.json({ userGoal });
    } catch (error) {
        console.error('Error creating user goal:', error);
        res.status(500).json({ error: 'Failed to create user goal' });
    }
});

// Get all user goals
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const userGoals = await prisma.userGoal.findMany({
            where: { userId },
            include: {
                goalProgress: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(userGoals);
    } catch (error) {
        console.error('Error fetching user goals:', error);
        res.status(500).json({ error: 'Failed to fetch user goals' });
    }
});

// Get current active goal
router.get('/current', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const currentGoal = await prisma.userGoal.findFirst({
            where: {
                userId,
                isCurrentGoal: true
            },
            include: {
                goalProgress: true
            }
        });

        res.json(currentGoal);
    } catch (error) {
        console.error('Error fetching current goal:', error);
        res.status(500).json({ error: 'Failed to fetch current goal' });
    }
});

// Update goal progress
router.put('/:goalId/progress', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { goalId } = req.params;
        const { progressType, isComplete } = req.body;

        // Verify goal belongs to user
        const userGoal = await prisma.userGoal.findFirst({
            where: {
                id: goalId,
                userId
            }
        });

        if (!userGoal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        // Update progress
        const progress = await prisma.goalProgress.upsert({
            where: {
                userGoalId_progressType: {
                    userGoalId: goalId,
                    progressType
                }
            },
            update: {
                isComplete,
                completedAt: isComplete ? new Date() : null,
                updatedAt: new Date()
            },
            create: {
                userId,
                userGoalId: goalId,
                progressType,
                isComplete,
                completedAt: isComplete ? new Date() : null
            }
        });

        // Calculate overall completion score
        const allProgress = await prisma.goalProgress.findMany({
            where: { userGoalId: goalId }
        });

        const completedCount = allProgress.filter(p => p.isComplete).length;
        const completionScore = Math.round((completedCount / allProgress.length) * 100);

        // Update goal completion score
        await prisma.userGoal.update({
            where: { id: goalId },
            data: {
                completionScore,
                status: completionScore >= 100 ? 'completed' : 'active',
                completedAt: completionScore >= 100 ? new Date() : null
            }
        });

        res.json({ progress, completionScore });
    } catch (error) {
        console.error('Error updating goal progress:', error);
        res.status(500).json({ error: 'Failed to update goal progress' });
    }
});

// Get goal progress
router.get('/:goalId/progress', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { goalId } = req.params;

        const progress = await prisma.goalProgress.findMany({
            where: {
                userGoalId: goalId,
                userId
            }
        });

        res.json(progress);
    } catch (error) {
        console.error('Error fetching goal progress:', error);
        res.status(500).json({ error: 'Failed to fetch goal progress' });
    }
});

// Save goal-specific financial data
router.post('/:goalId/data', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { goalId } = req.params;
        const { extractedData } = req.body;

        console.log('💾 Saving goal-specific data for goal:', goalId);

        // Verify goal belongs to user
        const userGoal = await prisma.userGoal.findFirst({
            where: {
                id: goalId,
                userId
            }
        });

        if (!userGoal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        // Save data with goalId association
        const result = await prisma.$transaction(async (tx) => {
            const promises = [];

            // Income
            if (extractedData.income?.length) {
                for (const income of extractedData.income) {
                    promises.push(
                        tx.income.create({
                            data: {
                                userId,
                                goalId,
                                text: income.text,
                                amount: income.amounts?.[0] || 0,
                                frequency: income.frequency || 'yearly',
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
                    promises.push(
                        tx.expense.create({
                            data: {
                                userId,
                                goalId,
                                text: expense.text,
                                amount: expense.amounts?.[0] || 0,
                                frequency: expense.frequency || 'monthly',
                                category: expense.category || 'expense'
                            }
                        })
                    );
                }
            }

            // Goals
            if (extractedData.goals?.length) {
                for (const goal of extractedData.goals) {
                    promises.push(
                        tx.goal.create({
                            data: {
                                userId,
                                goalId,
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

            // Assets
            if (extractedData.assets?.length) {
                for (const asset of extractedData.assets) {
                    promises.push(
                        tx.asset.create({
                            data: {
                                userId,
                                goalId,
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
                                goalId,
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
                    tx.riskProfile.upsert({
                        where: { userId },
                        update: {
                            text: extractedData.riskTolerance.text,
                            level: extractedData.riskTolerance.level,
                            goalId
                        },
                        create: {
                            userId,
                            goalId,
                            text: extractedData.riskTolerance.text,
                            level: extractedData.riskTolerance.level
                        }
                    })
                );
            }

            await Promise.all(promises);
            return true;
        });

        res.json({ success: true });
    } catch (error) {
        console.error('❌ Error saving goal-specific data:', error);
        res.status(500).json({ error: 'Failed to save goal-specific data' });
    }
});

// Helper function to determine progress types for each goal
function getProgressTypesForGoal(goalType) {
    switch (goalType) {
        case 'retirement':
            return ['income', 'pension', 'riskTolerance', 'retirementAge', 'expenses', 'assets'];
        case 'saving':
            return ['goals', 'income', 'expenses', 'timeframe', 'assets', 'savingsCapacity'];
        case 'investment':
            return ['riskTolerance', 'income', 'goals', 'timeframe', 'assets', 'diversification'];
        case 'protection':
            return ['income', 'dependents', 'expenses', 'debts', 'existingCover', 'assets'];
        case 'comprehensive':
            return ['income', 'expenses', 'goals', 'riskTolerance', 'assets', 'protection'];
        default:
            return ['income', 'expenses', 'goals', 'riskTolerance'];
    }
}

module.exports = router;