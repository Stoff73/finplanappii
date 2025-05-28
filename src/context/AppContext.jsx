import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import dataExtractionService from '../services/dataExtraction';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        name: '',
        goals: [],
        financialData: {}
    });

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

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('financialPlanningApp');
            if (saved) {
                const data = JSON.parse(saved);
                setUserData(data.userData || { name: '', goals: [], financialData: {} });
                setMessages(data.messages || []);

                // Ensure extractedData has proper structure
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
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }, []);

    // Extract data when messages change - with debugging
    useEffect(() => {
        if (messages.length > 0) {
            try {
                console.log('Processing messages for data extraction:', messages.length);

                // Get only user messages for extraction
                const userMessages = messages.filter(msg => msg.type === 'user');
                console.log('User messages found:', userMessages.length);

                if (userMessages.length > 0) {
                    const newExtractedData = dataExtractionService.extractFinancialData(messages);
                    console.log('Extracted data result:', newExtractedData);

                    const newInsights = dataExtractionService.generateInsights(newExtractedData);
                    console.log('Generated insights:', newInsights);

                    setExtractedData(newExtractedData);
                    setInsights(newInsights);
                }
            } catch (error) {
                console.error('Error extracting data:', error);
            }
        }
    }, [messages]);

    // Save to localStorage when data changes
    useEffect(() => {
        try {
            const dataToSave = {
                userData,
                messages,
                extractedData,
                insights,
                lastUpdated: new Date().toISOString()
            };
            console.log('Saving data to localStorage:', dataToSave);
            localStorage.setItem('financialPlanningApp', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }, [userData, messages, extractedData, insights]);

    // Enhanced addMessage function with better ID generation
    const addMessage = useCallback((message) => {
        const newMessage = {
            ...message,
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString()
        };

        console.log('Adding message:', newMessage);
        setMessages(prev => {
            const updated = [...prev, newMessage];
            console.log('Updated messages array:', updated);
            return updated;
        });
    }, []);

    const updateUserData = useCallback((newData) => {
        setUserData(prev => ({ ...prev, ...newData }));
    }, []);

    // Enhanced clearAllData function
    const clearAllData = useCallback(() => {
        console.log('Clearing all data');
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

        try {
            localStorage.removeItem('financialPlanningApp');
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }, []);

    const getCompletionScore = useCallback(() => {
        try {
            const score = dataExtractionService.calculateCompletionScore(extractedData);
            console.log('Completion score calculated:', score, 'for data:', extractedData);
            return score;
        } catch (error) {
            console.error('Error calculating completion score:', error);
            return 0;
        }
    }, [extractedData]);

    // Force re-extraction function for debugging
    const forceDataExtraction = useCallback(() => {
        console.log('Force re-extracting data from messages:', messages);
        if (messages.length > 0) {
            const newExtractedData = dataExtractionService.extractFinancialData(messages);
            const newInsights = dataExtractionService.generateInsights(newExtractedData);

            console.log('Force extraction result:', newExtractedData);
            setExtractedData(newExtractedData);
            setInsights(newInsights);
        }
    }, [messages]);

    // Additional helper function for manual data updates (used by DataSummary component)
    const updateExtractedData = useCallback((newData) => {
        console.log('Manually updating extracted data:', newData);
        setExtractedData(newData);

        // Also update insights when data is manually updated
        try {
            const newInsights = dataExtractionService.generateInsights(newData);
            setInsights(newInsights);
        } catch (error) {
            console.error('Error generating insights:', error);
        }
    }, []);

    // Helper function to get insights (for components that need it)
    const getInsights = useCallback(() => {
        return insights;
    }, [insights]);

    // Enhanced context value with all necessary functions
    const contextValue = {
        // Existing state
        userData,
        messages,
        extractedData,
        insights,

        // Existing functions
        addMessage,
        updateUserData,
        clearAllData,
        getCompletionScore,

        // Additional functions for better integration
        updateExtractedData,
        getInsights,
        forceDataExtraction // For debugging
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};


