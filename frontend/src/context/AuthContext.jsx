import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bookverse_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('bookverse_user');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/api/auth/register', { name, email, password });
      if (data.success) {
        localStorage.setItem('bookverse_token', data.token);
        localStorage.setItem('bookverse_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success('Registration successful! Welcome to BookVerse!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/api/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('bookverse_token', data.token);
        localStorage.setItem('bookverse_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success('Welcome back!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('bookverse_token');
    localStorage.removeItem('bookverse_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
