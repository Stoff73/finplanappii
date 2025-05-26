import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('financialPlanningApp');

            if (saved) {
                const data = JSON.parse(saved);

                if (data.userData) {
                    setUserData(data.userData);
                }
                if (data.messages) {
                    setMessages(data.messages);
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage when data changes (but only after initial load)
    useEffect(() => {
        if (isLoaded) {
            try {
                const dataToSave = {
                    userData,
                    messages
                };
                localStorage.setItem('financialPlanningApp', JSON.stringify(dataToSave));
            } catch (error) {
                console.error('Error saving data:', error);
            }
        }
    }, [userData, messages, isLoaded]);

    const addMessage = (message) => {
        const newMessage = {
            ...message,
            id: Date.now(),
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const updateUserData = (newData) => {
        setUserData(prev => ({ ...prev, ...newData }));
    };

    const clearAllData = () => {
        setUserData({ name: '', goals: [], financialData: {} });
        setMessages([]);
        localStorage.removeItem('financialPlanningApp');
    };

    // Basic completion score calculation
    const getCompletionScore = () => {
        let score = 0;
        if (messages.length > 2) score += 25; // Has had conversation
        if (userData.goals && userData.goals.length > 0) score += 25; // Has goals
        if (userData.financialData && Object.keys(userData.financialData).length > 0) score += 25; // Has financial data
        if (messages.length > 5) score += 25; // Extended conversation
        return Math.min(score, 100);
    };

    return (
        <AppContext.Provider value={{
            userData,
            messages,
            addMessage,
            updateUserData,
            clearAllData,
            getCompletionScore
        }}>
            {children}
        </AppContext.Provider>
    );
};

