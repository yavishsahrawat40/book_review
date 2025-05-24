import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token && !currentUser) {
      setLoading(true);
      try {
        const response = await apiClient.get('/users/profile');
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user profile with token:", error.response ? error.response.data : error.message);
        localStorage.removeItem('authToken');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    setInitialLoadDone(true);
  }, [currentUser]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setCurrentUser(response.data.user);
        setLoading(false);
        return { success: true, user: response.data.user };
      } else {
        setLoading(false);
        return { success: false, message: response.data.message || "Login failed: No token received." };
      }
    } catch (error) {
      setLoading(false);
      console.error("Login API error:", error.response ? error.response.data : error.message);
      return { success: false, message: error.response?.data?.message || "Login failed. Please try again." };
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/signup', { username, email, password });
      setLoading(false);
      if (response.status === 201 && response.data) {
        return { success: true, user: response.data.user, message: response.data.message };
      } else {
        return { success: false, message: response.data.message || "Signup failed." };
      }
    } catch (error) {
      setLoading(false);
      console.error("Signup API error:", error.response ? error.response.data : error.message);
      return { success: false, message: error.response?.data?.message || "Signup failed. Please try again." };
    }
  };

  const logout = useCallback(() => {
    setLoading(true);
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setLoading(false);
    console.log("User logged out.");
  }, []);
  
  const updateUserContext = useCallback((updatedUserData) => {
    setCurrentUser(prevUser => ({ ...prevUser, ...updatedUserData }));
  }, []);

  const value = useMemo(() => ({
    currentUser,
    loading,
    initialLoadDone,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser,
    fetchUserProfile,
    updateUserContext
  }), [currentUser, loading, initialLoadDone, logout, fetchUserProfile, updateUserContext]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};