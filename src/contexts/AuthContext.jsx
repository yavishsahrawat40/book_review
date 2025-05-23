import React, { createContext, useState, useContext, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Example: { id: '1', name: 'John Doe', email: 'john@example.com' }
  const [loading, setLoading] = useState(false); // For async operations like login/logout

  // Mock login function
  const login = async (email, password) => {
    setLoading(true);
    console.log("Attempting login with:", email); // Keep console.log for debugging
    return new Promise(resolve => {
      setTimeout(() => {
        if (email === "user@example.com" && password === "password") {
          const user = { id: '1', name: 'Test User', email: 'user@example.com', isAdmin: false };
          setCurrentUser(user);
          setLoading(false);
          resolve({ success: true, user });
        } else if (email === "admin@example.com" && password === "password") {
          const user = { id: '2', name: 'Admin User', email: 'admin@example.com', isAdmin: true };
          setCurrentUser(user);
          setLoading(false);
          resolve({ success: true, user });
        }
        else {
          setLoading(false);
          resolve({ success: false, message: "Invalid credentials" });
        }
      }, 1000);
    });
  };

  // Mock logout function
  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentUser(null);
      setLoading(false);
    }, 500);
  };
  
  // Mock signup function
  const signup = async (username, email, password) => {
    setLoading(true);
    console.log("Attempting signup for:", username, email);
    return new Promise(resolve => {
        setTimeout(() => {
            // Simulate checking if email exists - for now, always succeed
            const newUser = { id: Date.now().toString(), name: username, email, isAdmin: false };
            // In a real app, you might want to log in the user immediately after signup
            // setCurrentUser(newUser); 
            setLoading(false);
            resolve({ success: true, user: newUser });
        }, 1000);
    });
  };


  const value = useMemo(() => ({
    currentUser,
    loading,
    login,
    logout,
    signup,
    isAuthenticated: !!currentUser,
  }), [currentUser, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};