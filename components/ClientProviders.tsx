"use client";

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { Toaster } from '@/components/ui/sonner';

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
                <DataProvider>
                    {children}
                    <Toaster />
                </DataProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
