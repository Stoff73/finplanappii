// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                // Note: We're not storing password in this schema yet
                // You might want to add a password field to the User model
            }
        });

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // For now, we'll skip password verification since we haven't implemented it yet
        // TODO: Implement proper password verification
        // const isValidPassword = await bcrypt.compare(password, user.password);
        // if (!isValidPassword) {
        //   return res.status(400).json({ error: 'Invalid credentials' });
        // }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Update last active
        await prisma.user.update({
            where: { id: user.id },
            data: { lastActive: new Date() }
        });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                completionScore: user.completionScore
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                completionScore: true,
                createdAt: true,
                lastActive: true
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

// Create a guest user (for testing without full auth)
router.post('/guest', async (req, res) => {
    try {
        const guestEmail = `guest_${Date.now()}@temporary.com`;

        const user = await prisma.user.create({
            data: {
                email: guestEmail,
                name: 'Guest User'
            }
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isGuest: true
            }
        });
    } catch (error) {
        console.error('Guest user creation error:', error);
        res.status(500).json({ error: 'Failed to create guest user' });
    }
});

module.exports = router;