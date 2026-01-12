"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role?: string;
    bio?: string;
    location?: string;
    department?: string;
    phone?: string;
    joinDate?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('marinefrost_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simulate API call
        const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            avatar: 'https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzcxNjQ1NHww&ixlib=rb-4.1.0&q=80&w=400',
            role: 'Product Manager',
            bio: 'Building amazing products'
        };

        setUser(mockUser);
        localStorage.setItem('marinefrost_user', JSON.stringify(mockUser));
        return true;
    };

    const register = async (email: string, password: string, name: string): Promise<boolean> => {
        // Simulate API call
        const mockUser: User = {
            id: Date.now().toString(),
            email,
            name,
            avatar: 'https://images.unsplash.com/photo-1524538198441-241ff79d153b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbnxlbnwxfHx8fDE3Njc3Njc3NTF8MA&ixlib=rb-4.1.0&q=80&w=400',
            role: 'Developer',
            bio: ''
        };

        setUser(mockUser);
        localStorage.setItem('marinefrost_user', JSON.stringify(mockUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('marinefrost_user');
    };

    const updateProfile = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
            localStorage.setItem('marinefrost_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
