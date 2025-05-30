// server/routes/users.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                completionScore: true,
                createdAt: true,
                lastActive: true,
                _count: {
                    select: {
                        messages: true,
                        goals: true,
                        incomeItems: true,
                        expenses: true,
                        assets: true,
                        debts: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, email } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                lastActive: new Date()
            },
            select: {
                id: true,
                email: true,
                name: true,
                completionScore: true,
                lastActive: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Failed to update user profile' });
        }
    }
});

// Delete user account
router.delete('/account', authMiddleware, async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: req.user.id }
        });

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// Get user statistics
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const stats = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                completionScore: true,
                createdAt: true,
                lastActive: true,
                _count: {
                    select: {
                        messages: true,
                        goals: true,
                        incomeItems: true,
                        expenses: true,
                        assets: true,
                        debts: true
                    }
                }
            }
        });

        if (!stats) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Calculate some additional stats
        const daysSinceJoined = Math.floor(
            (new Date() - new Date(stats.createdAt)) / (1000 * 60 * 60 * 24)
        );

        const daysSinceLastActive = Math.floor(
            (new Date() - new Date(stats.lastActive)) / (1000 * 60 * 60 * 24)
        );

        res.json({
            ...stats,
            daysSinceJoined,
            daysSinceLastActive,
            totalDataPoints: Object.values(stats._count).reduce((sum, count) => sum + count, 0)
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});

module.exports = router;