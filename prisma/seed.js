// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create a test user
    const testUser = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            name: 'Test User',
            completionScore: 75,
        },
    });

    console.log('Created test user:', testUser);

    // Create sample financial data for the test user
    const sampleData = {
        // Sample income
        income: [
            {
                text: '£50,000 per year employment income',
                amount: 50000,
                frequency: 'yearly',
                category: 'income',
                source: 'employment',
                userId: testUser.id,
            },
        ],

        // Sample expenses
        expenses: [
            {
                text: '£1,200 per month rent',
                amount: 1200,
                frequency: 'monthly',
                category: 'housing',
                userId: testUser.id,
            },
            {
                text: '£300 per month food',
                amount: 300,
                frequency: 'monthly',
                category: 'food',
                userId: testUser.id,
            },
            {
                text: '£200 per month transport',
                amount: 200,
                frequency: 'monthly',
                category: 'transport',
                userId: testUser.id,
            },
        ],

        // Sample goals
        goals: [
            {
                text: 'Buy a house in 5 years',
                type: JSON.stringify(['house', 'property']),
                amounts: JSON.stringify([300000]),
                timeframes: JSON.stringify([{ value: 5, unit: 'years' }]),
                category: 'goal',
                userId: testUser.id,
            },
            {
                text: 'Retire at 65',
                type: JSON.stringify(['retirement']),
                amounts: JSON.stringify([]),
                timeframes: JSON.stringify([{ value: 65, unit: 'age' }]),
                category: 'goal',
                userId: testUser.id,
            },
        ],

        // Sample assets
        assets: [
            {
                text: '£15,000 savings',
                amount: 15000,
                type: 'savings',
                userId: testUser.id,
            },
        ],

        // Sample risk profile
        riskProfile: {
            text: 'Medium risk investor',
            level: 'medium',
            userId: testUser.id,
        },

        // Sample messages
        messages: [
            {
                content: 'Hello! I\'m looking to get help with my financial planning.',
                type: 'user',
                userId: testUser.id,
            },
            {
                content: 'Great! I\'d be happy to help you with your financial planning. Could you tell me about your current income?',
                type: 'ai',
                userId: testUser.id,
            },
            {
                content: 'I earn £50k per year from my job.',
                type: 'user',
                userId: testUser.id,
            },
            {
                content: 'Excellent! That\'s a good foundation. What about your monthly expenses?',
                type: 'ai',
                userId: testUser.id,
            },
            {
                content: 'My rent is £1200 per month, and I spend about £300 on food and £200 on transport.',
                type: 'user',
                userId: testUser.id,
            },
        ],
    };

    // Create sample data using individual create calls
    console.log('Creating sample income data...');
    for (const incomeData of sampleData.income) {
        await prisma.income.create({ data: incomeData });
    }

    console.log('Creating sample expense data...');
    for (const expenseData of sampleData.expenses) {
        await prisma.expense.create({ data: expenseData });
    }

    console.log('Creating sample goal data...');
    for (const goalData of sampleData.goals) {
        await prisma.goal.create({ data: goalData });
    }

    console.log('Creating sample asset data...');
    for (const assetData of sampleData.assets) {
        await prisma.asset.create({ data: assetData });
    }

    console.log('Creating sample risk profile...');
    await prisma.riskProfile.create({ data: sampleData.riskProfile });

    console.log('Creating sample messages...');
    for (const messageData of sampleData.messages) {
        await prisma.message.create({ data: messageData });
    }

    console.log('✅ Database seeded successfully!');
    console.log(`Test user created with email: ${testUser.email}`);
    console.log('You can now test the application with this sample data.');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });