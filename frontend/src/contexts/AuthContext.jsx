import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

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
        // Check if user is logged in on mount
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (credentials, isAdmin = false) => {
        try {
            const response = isAdmin
                ? await authService.loginAdmin(credentials)
                : await authService.loginCustomer(credentials);

            if (response.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, error: response.error };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: { message: error.userMessage || 'Login failed' },
            };
        }
    };

    const register = async (data) => {
        try {
            const response = await authService.registerCustomer(data);
            if (response.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, error: response.error };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: { message: error.userMessage || 'Registration failed' },
            };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.type === 'admin',
        isCustomer: user?.type === 'customer',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-customer-primary text-xl">Loading...</div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
