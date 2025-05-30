// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Ensure we're in the right directory
process.chdir(path.join(__dirname, '..'));
console.log('Working directory:', process.cwd());

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3002'], // Support both ports
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/financial-data', require('./routes/financial-data'));
app.use('/api/goals', require('./routes/goals'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Graceful shutdown
const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Database connected: ${process.env.DATABASE_URL}`);
});