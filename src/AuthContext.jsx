import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/current-user`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      setUser(res.data.data);
      setLogin(true);
    } catch (error) {
      setUser(null);
      setLogin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    setLogin(true);
  };

  const logoutUser = () => {
    setUser(null);
    setLogin(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, loading, loginUser, logoutUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
