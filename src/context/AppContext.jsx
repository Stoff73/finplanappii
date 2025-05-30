// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import dataExtractionService from '../services/dataExtraction';
import apiService from '../services/api';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    // Authentication state
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Goal selection state
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [userGoals, setUserGoals] = useState([]);
    const [goalProgress, setGoalProgress] = useState({});

    // Legacy userData structure for compatibility
    const [userData, setUserData] = useState({
        name: '',
        goals: [],
        financialData: {}
    });

    // App state
    const [messages, setMessages] = useState([]);
    const [extractedData, setExtractedData] = useState({
        income: [],
        expenses: [],
        goals: [],
        assets: [],
        debts: [],
        riskTolerance: null,
        timeline: []
    });
    const [insights, setInsights] = useState([]);
    const [isOnline, setIsOnline] = useState(true);

    // Goal definitions for progress tracking
    const goalDefinitions = {
        retirement: {
            label: 'Retirement Planning',
            requiredFields: ['income', 'expenses', 'riskTolerance', 'goals'],
            weights: { income: 30, expenses: 20, riskTolerance: 25, goals: 25 }
        },
        house: {
            label: 'House Purchase',
            requiredFields: ['income', 'expenses', 'goals', 'assets'],
            weights: { income: 35, expenses: 25, goals: 25, assets: 15 }
        },
        emergency: {
            label: 'Emergency Fund',
            requiredFields: ['expenses', 'goals', 'assets'],
            weights: { expenses: 40, goals: 35, assets: 25 }
        },
        investment: {
            label: 'Investment Planning',
            requiredFields: ['income', 'riskTolerance', 'goals', 'assets'],
            weights: { income: 25, riskTolerance: 30, goals: 25, assets: 20 }
        },
        debt: {
            label: 'Debt Management',
            requiredFields: ['income', 'expenses', 'debts', 'goals'],
            weights: { income: 25, expenses: 25, debts: 35, goals: 15 }
        },
        education: {
            label: 'Education Planning',
            requiredFields: ['income', 'goals', 'assets'],
            weights: { income: 35, goals: 40, assets: 25 }
        }
    };

    // Initialize app
    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            setIsLoading(true);
            console.log('🚀 Initializing app...');

            // Try to create guest user first
            try {
                console.log('Creating guest user...');
                const response = await apiService.createGuestUser();
                console.log('✅ Guest user created:', response);

                apiService.setToken(response.token);
                setUser(response.user);
                setIsAuthenticated(true);
                setIsOnline(true);

                // Load existing data for this user
                await loadUserData();

            } catch (error) {
                console.log('❌ Guest user creation failed, using localStorage:', error);
                setIsOnline(false);
                loadFromLocalStorage();
            }
        } catch (error) {
            console.error('App initialization error:', error);
            loadFromLocalStorage();
        } finally {
            setIsLoading(false);
        }
    };

    const loadUserData = async () => {
        try {
            console.log('📥 Loading user data from database...');
            const [messagesData, financialData] = await Promise.all([
                apiService.getMessages(),
                apiService.getFinancialData()
            ]);

            console.log('Messages loaded:', messagesData);
            console.log('Financial data loaded:', financialData);

            setMessages(messagesData);
            setExtractedData(financialData);

            // Generate insights from loaded data
            const newInsights = dataExtractionService.generateInsights(financialData);
            setInsights(newInsights);

            // Load goal selection from stored data
            const storedGoal = localStorage.getItem('selectedGoal');
            if (storedGoal) {
                setSelectedGoal(storedGoal);
            }

        } catch (error) {
            console.error('Error loading user data:', error);
            // Fall back to localStorage
            loadFromLocalStorage();
        }
    };

    const loadFromLocalStorage = () => {
        try {
            console.log('📥 Loading from localStorage...');
            const saved = localStorage.getItem('financialPlanningApp');
            if (saved) {
                const data = JSON.parse(saved);
                setUserData(data.userData || { name: '', goals: [], financialData: {} });
                setMessages(data.messages || []);

                const savedExtractedData = data.extractedData || {};
                setExtractedData({
                    income: savedExtractedData.income || [],
                    expenses: savedExtractedData.expenses || [],
                    goals: savedExtractedData.goals || [],
                    assets: savedExtractedData.assets || [],
                    debts: savedExtractedData.debts || [],
                    riskTolerance: savedExtractedData.riskTolerance || null,
                    timeline: savedExtractedData.timeline || []
                });

                setInsights(data.insights || []);
                setSelectedGoal(data.selectedGoal || null);
                setUserGoals(data.userGoals || []);
                setGoalProgress(data.goalProgress || {});

                console.log('✅ Data loaded from localStorage');
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    };

    // Calculate goal-specific progress
    const calculateGoalProgress = useCallback((goalType, data) => {
        if (!goalDefinitions[goalType]) return 0;

        const definition = goalDefinitions[goalType];
        let totalScore = 0;

        definition.requiredFields.forEach(field => {
            const weight = definition.weights[field];
            const fieldData = data[field];

            let hasData = false;
            if (Array.isArray(fieldData)) {
                hasData = fieldData.length > 0;
            } else if (fieldData !== null && fieldData !== undefined) {
                hasData = true;
            }

            if (hasData) {
                totalScore += weight;
            }
        });

        return Math.min(totalScore, 100);
    }, []);

    // Update goal progress when data changes
    useEffect(() => {
        if (selectedGoal && extractedData) {
            const progress = calculateGoalProgress(selectedGoal, extractedData);
            setGoalProgress(prev => ({
                ...prev,
                [selectedGoal]: progress
            }));
        }
    }, [selectedGoal, extractedData, calculateGoalProgress]);

    // Extract data when messages change
    useEffect(() => {
        if (messages.length > 0) {
            try {
                console.log('🔄 Processing messages for data extraction:', messages.length);

                const userMessages = messages.filter(msg => msg.type === 'user');
                console.log('User messages found:', userMessages.length);

                if (userMessages.length > 0) {
                    const newExtractedData = dataExtractionService.extractFinancialData(messages);
                    console.log('📊 Extracted data:', newExtractedData);

                    // Enhanced insights with goal context
                    const newInsights = dataExtractionService.generateInsights(newExtractedData, selectedGoal);
                    console.log('💡 Generated insights:', newInsights);

                    setExtractedData(newExtractedData);
                    setInsights(newInsights);

                    // Save to database if online and authenticated
                    if (isOnline && isAuthenticated) {
                        console.log('💾 Saving to database...');
                        saveFinancialData(newExtractedData);
                    }
                }
            } catch (error) {
                console.error('Error extracting data:', error);
            }
        }
    }, [messages, isOnline, isAuthenticated, selectedGoal]);

    // Save to localStorage as backup including goal data
    useEffect(() => {
        if (!isLoading) {
            try {
                const dataToSave = {
                    userData,
                    messages,
                    extractedData,
                    insights,
                    selectedGoal,
                    userGoals,
                    goalProgress,
                    lastUpdated: new Date().toISOString()
                };
                localStorage.setItem('financialPlanningApp', JSON.stringify(dataToSave));
                localStorage.setItem('selectedGoal', selectedGoal || '');
                console.log('💾 Data saved to localStorage');
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        }
    }, [userData, messages, extractedData, insights, selectedGoal, userGoals, goalProgress, isLoading]);

    const saveFinancialData = async (data) => {
        try {
            console.log('💾 Saving financial data to database:', data);
            await apiService.saveFinancialData(data);
            console.log('✅ Financial data saved to database');
        } catch (error) {
            console.error('❌ Error saving financial data:', error);
            // Data will still be saved to localStorage as backup
        }
    };

    // Goal management functions
    const handleGoalSelection = useCallback((goalType) => {
        console.log('🎯 Goal selected:', goalType);
        setSelectedGoal(goalType);

        // Add to user goals if not already present
        if (!userGoals.includes(goalType)) {
            setUserGoals(prev => [...prev, goalType]);
        }

        // Initialize progress tracking
        const progress = calculateGoalProgress(goalType, extractedData);
        setGoalProgress(prev => ({
            ...prev,
            [goalType]: progress
        }));
    }, [userGoals, extractedData, calculateGoalProgress]);

    const getGoalSpecificData = useCallback((goalType) => {
        if (!goalDefinitions[goalType]) return {};

        const definition = goalDefinitions[goalType];
        const goalData = {};

        definition.requiredFields.forEach(field => {
            goalData[field] = extractedData[field];
        });

        return goalData;
    }, [extractedData]);

    const isGoalComplete = useCallback((goalType) => {
        const progress = goalProgress[goalType] || 0;
        return progress >= 80; // Consider 80%+ as complete
    }, [goalProgress]);

    // Message management
    const addMessage = useCallback(async (message) => {
        const newMessage = {
            ...message,
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            goalContext: selectedGoal // Add goal context to messages
        };

        console.log('💬 Adding message:', newMessage);

        // Update local state immediately
        setMessages(prev => {
            const updated = [...prev, newMessage];
            console.log('📝 Updated messages:', updated.length);
            return updated;
        });

        // Save to database if online and authenticated
        if (isOnline && isAuthenticated) {
            try {
                console.log('💾 Saving message to database...');
                await apiService.addMessage({
                    content: newMessage.content,
                    type: newMessage.type,
                    goalContext: selectedGoal
                });
                console.log('✅ Message saved to database');
            } catch (error) {
                console.error('❌ Error saving message to database:', error);
                // Message is still saved locally
            }
        }
    }, [isOnline, isAuthenticated, selectedGoal]);

    const clearAllData = useCallback(async () => {
        console.log('🗑️ Clearing all data');

        // Clear local state
        setUserData({ name: '', goals: [], financialData: {} });
        setMessages([]);
        setExtractedData({
            income: [],
            expenses: [],
            goals: [],
            assets: [],
            debts: [],
            riskTolerance: null,
            timeline: []
        });
        setInsights([]);
        setSelectedGoal(null);
        setUserGoals([]);
        setGoalProgress({});

        // Clear database if online and authenticated
        if (isOnline && isAuthenticated) {
            try {
                await apiService.clearMessages();
            } catch (error) {
                console.error('Error clearing data from database:', error);
            }
        }

        // Clear localStorage
        try {
            localStorage.removeItem('financialPlanningApp');
            localStorage.removeItem('selectedGoal');
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }, [isOnline, isAuthenticated]);

    // Helper functions
    const updateUserData = useCallback((newData) => {
        setUserData(prev => ({ ...prev, ...newData }));
    }, []);

    const getCompletionScore = useCallback(() => {
        try {
            if (selectedGoal) {
                // Return goal-specific completion score
                return goalProgress[selectedGoal] || 0;
            } else {
                // Return overall completion score
                const score = dataExtractionService.calculateCompletionScore(extractedData);
                console.log('📊 Overall completion score:', score, 'for data:', extractedData);
                return score;
            }
        } catch (error) {
            console.error('Error calculating completion score:', error);
            return 0;
        }
    }, [extractedData, selectedGoal, goalProgress]);

    const updateExtractedData = useCallback((newData) => {
        console.log('🔄 Manually updating extracted data:', newData);
        setExtractedData(newData);

        try {
            const newInsights = dataExtractionService.generateInsights(newData, selectedGoal);
            setInsights(newInsights);
        } catch (error) {
            console.error('Error generating insights:', error);
        }

        // Save to database if online
        if (isOnline && isAuthenticated) {
            saveFinancialData(newData);
        }
    }, [isOnline, isAuthenticated, selectedGoal]);

    const getInsights = useCallback(() => {
        return insights;
    }, [insights]);

    const forceDataExtraction = useCallback(() => {
        console.log('🔄 Force re-extracting data from messages:', messages);
        if (messages.length > 0) {
            const newExtractedData = dataExtractionService.extractFinancialData(messages);
            const newInsights = dataExtractionService.generateInsights(newExtractedData, selectedGoal);

            setExtractedData(newExtractedData);
            setInsights(newInsights);

            if (isOnline && isAuthenticated) {
                saveFinancialData(newExtractedData);
            }
        }
    }, [messages, isOnline, isAuthenticated, selectedGoal]);

    // Goal-specific helper functions
    const getGoalRequirements = useCallback((goalType) => {
        return goalDefinitions[goalType] || null;
    }, []);

    const getMissingRequirements = useCallback((goalType) => {
        const definition = goalDefinitions[goalType];
        if (!definition) return [];

        const missing = [];
        definition.requiredFields.forEach(field => {
            const fieldData = extractedData[field];
            let hasData = false;

            if (Array.isArray(fieldData)) {
                hasData = fieldData.length > 0;
            } else if (fieldData !== null && fieldData !== undefined) {
                hasData = true;
            }

            if (!hasData) {
                missing.push(field);
            }
        });

        return missing;
    }, [extractedData]);

    const getNextQuestions = useCallback((goalType) => {
        const missing = getMissingRequirements(goalType);
        const questions = {
            income: "What's your current annual income from all sources?",
            expenses: "What are your main monthly expenses?",
            goals: `What are your specific ${goalDefinitions[goalType]?.label.toLowerCase()} goals?`,
            riskTolerance: "How would you describe your approach to investment risk?",
            assets: "Do you have any existing savings or investments?",
            debts: "Do you have any outstanding debts or loans?"
        };

        return missing.map(field => questions[field]).filter(Boolean);
    }, [getMissingRequirements]);

    const contextValue = {
        // Authentication state
        user,
        isAuthenticated,
        isLoading,
        isOnline,

        // Goal management
        selectedGoal,
        setSelectedGoal: handleGoalSelection,
        userGoals,
        goalProgress,
        goalDefinitions,
        isGoalComplete,
        getGoalSpecificData,
        getGoalRequirements,
        getMissingRequirements,
        getNextQuestions,

        // Legacy state for compatibility
        userData,
        messages,
        extractedData,
        insights,

        // Data methods
        addMessage,
        updateUserData,
        clearAllData,
        updateExtractedData,
        forceDataExtraction,

        // Helper methods
        getCompletionScore,
        getInsights,

        // Debug info
        debugInfo: {
            messagesCount: messages.length,
            isOnline,
            isAuthenticated,
            userId: user?.id,
            selectedGoal,
            goalProgressScores: goalProgress
        }
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
