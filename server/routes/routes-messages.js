// server/routes/messages.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all messages for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'asc' }
        });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Add a new message
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { content, type } = req.body;

        const message = await prisma.message.create({
            data: {
                content,
                type,
                userId: req.user.id
            }
        });

        res.json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
});

// Clear all messages for a user
router.delete('/', authMiddleware, async (req, res) => {
    try {
        await prisma.message.deleteMany({
            where: { userId: req.user.id }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting messages:', error);
        res.status(500).json({ error: 'Failed to delete messages' });
    }
});

module.exports = router;