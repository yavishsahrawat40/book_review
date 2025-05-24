import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null); 

  const addNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); 
  }, []);

  const value = useMemo(() => ({ addNotification }), [addNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-xl text-white text-sm z-[100]
            ${notification.type === 'success' ? 'bg-green-500' : ''}
            ${notification.type === 'error' ? 'bg-red-500' : ''}
            ${notification.type === 'info' ? 'bg-blue-500' : ''}
            ${notification.type === 'warning' ? 'bg-yellow-500' : ''}
          `}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
