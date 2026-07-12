import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    setToken(response.data.token);
    setAdmin(response.data.admin);
    return response.data;
  };

  const register = async (email, password, name) => {
    const response = await axios.post('/api/auth/register', { email, password, name });
    setToken(response.data.token);
    setAdmin(response.data.admin);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  const value = {
    token,
    admin,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
