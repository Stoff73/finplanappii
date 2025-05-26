import React, { createContext, useContext, useState, useEffect } from 'react';
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
    const [extractedData, setExtractedData] = useState({});
    const [insights, setInsights] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('financialPlanningApp');
            if (saved) {
                const data = JSON.parse(saved);
                setUserData(data.userData || {});
                setMessages(data.messages || []);
                setExtractedData(data.extractedData || {});
                setInsights(data.insights || []);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }, []);

    // Extract data when messages change
    useEffect(() => {
        if (messages.length > 0) {
            const newExtractedData = dataExtractionService.extractFinancialData(messages);
            const newInsights = dataExtractionService.generateInsights(newExtractedData);

            setExtractedData(newExtractedData);
            setInsights(newInsights);
        }
    }, [messages]);

    // Save to localStorage when data changes
    useEffect(() => {
        try {
            localStorage.setItem('financialPlanningApp', JSON.stringify({
                userData,
                messages,
                extractedData,
                insights
            }));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }, [userData, messages, extractedData, insights]);

    const addMessage = (message) => {
        setMessages(prev => [...prev, {
            ...message,
            id: Date.now(),
            timestamp: new Date()
        }]);
    };

    const updateUserData = (newData) => {
        setUserData(prev => ({ ...prev, ...newData }));
    };

    const clearAllData = () => {
        setUserData({ name: '', goals: [], financialData: {} });
        setMessages([]);
        setExtractedData({});
        setInsights([]);
        localStorage.removeItem('financialPlanningApp');
    };

    const getCompletionScore = () => {
        return dataExtractionService.calculateCompletionScore(extractedData);
    };

    return (
        <AppContext.Provider value={{
            userData,
            messages,
            extractedData,
            insights,
            addMessage,
            updateUserData,
            clearAllData,
            getCompletionScore
        }}>
            {children}
        </AppContext.Provider>
    );
};


