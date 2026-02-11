import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMe = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user", error);
            localStorage.removeItem('token');
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchMe();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            // Use URLSearchParams to send application/x-www-form-urlencoded
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const { access_token } = response.data;

            localStorage.setItem('token', access_token);
            await fetchMe();
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            let msg = "Login failed";
            if (error.response) {
                // Server responded with an error
                msg = error.response.data.detail || "Server error";
            } else if (error.request) {
                // Request blocked (CORS, network down)
                msg = "Network error - check backend connection";
            } else {
                msg = error.message;
            }
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
