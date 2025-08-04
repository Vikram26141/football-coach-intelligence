import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, handleAPIError, handleAPISuccess } from './api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const accessToken = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (accessToken && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Call backend API
      const response = await authAPI.signin({ email, password });
      const result = handleAPISuccess(response);
      
      if (result.data) {
        const { user, access_token } = result.data;
        
        // Store token and user data
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        toast.success('Signed in successfully!');
        return { success: true };
      }
    } catch (error) {
      const errorResult = handleAPIError(error);
      toast.error(errorResult.message);
      return { success: false, error: errorResult.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      
      // Call backend API
      const response = await authAPI.signup({ name, email, password });
      const result = handleAPISuccess(response);
      
      if (result.data) {
        const { user, access_token } = result.data;
        
        // Store token and user data
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        toast.success('Account created successfully!');
        return { success: true };
      }
    } catch (error) {
      const errorResult = handleAPIError(error);
      toast.error(errorResult.message);
      return { success: false, error: errorResult.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Signed out successfully!');
  };

  const updateUser = async (userData) => {
    try {
      setLoading(true);
      
      // Call backend API
      const response = await authAPI.updateProfile(userData);
      const result = handleAPISuccess(response);
      
      if (result.data) {
        const updatedUser = result.data.user;
        
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const errorResult = handleAPIError(error);
      toast.error(errorResult.message);
      return { success: false, error: errorResult.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
