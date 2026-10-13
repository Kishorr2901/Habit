import React, { createContext, useState, useEffect } from 'react';
import { apiCall } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('habitgarden_token');
      if (token) {
        try {
          const userData = await apiCall('/auth/me');
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user session:', error.message);
          localStorage.removeItem('habitgarden_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const data = await apiCall('/auth/login', 'POST', { email, password });
    localStorage.setItem('habitgarden_token', data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      points: data.points,
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      createdAt: data.createdAt
    });
    return data;
  };

  const register = async (name, email, password, confirmPassword) => {
    const data = await apiCall('/auth/register', 'POST', { name, email, password, confirmPassword });
    localStorage.setItem('habitgarden_token', data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      points: data.points,
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      createdAt: data.createdAt
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('habitgarden_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await apiCall('/auth/me');
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user data:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
