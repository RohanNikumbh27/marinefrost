"use client";

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Moon, Sun, Bell, User, LogOut, Menu, FileText, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NotificationsPanel from '@/components/NotificationsPanel';
import Logo from '@/components/Logo';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuth();
    const { notifications } = useData();
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center px-6 max-w-[1600px]">
                    <Link href="/dashboard" className="flex items-center space-x-3 mr-8 group">
                        <div className="transition-transform group-hover:scale-110">
                            <Logo className="h-10 w-10" />
                        </div>
                        <span className="hidden md:inline-block font-semibold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            MarineFrost
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8 flex-1">
                        <Link href="/dashboard" className={`text-sm transition-colors hover:text-primary ${pathname === '/dashboard' ? 'text-foreground' : 'text-muted-foreground'}`}>
                            <div className="flex items-center space-x-2">
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Projects</span>
                            </div>
                        </Link>
                        <Link
                            href="/marinedox"
                            className={`text-sm transition-colors hover:text-[var(--marinedox-primary)] ${pathname?.startsWith('/marinedox') ? 'text-[var(--marinedox-primary)]' : 'text-muted-foreground'}`}
                        >
                            <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>MarineDox</span>
                            </div>
                        </Link>
                        <Link
                            href="/chat"
                            className={`text-sm transition-colors hover:text-blue-500 ${pathname?.startsWith('/chat') ? 'text-blue-500' : 'text-muted-foreground'}`}
                        >
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>Chat</span>
                            </div>
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3 ml-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="rounded-xl"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-xl relative">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:w-[500px] p-0 [&>button]:hidden">
                                <div className="h-full overflow-hidden">
                                    <NotificationsPanel onClose={() => setShowNotifications(false)} />
                                </div>
                            </SheetContent>
                        </Sheet>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user?.avatar} alt={user?.name} />
                                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col">
                                        <p className="font-medium">{user?.name}</p>
                                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer rounded-xl">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-xl text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon" className="rounded-xl">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-[300px] sm:w-[350px] p-0 border-l-0 overflow-hidden [&>button]:hidden"
                            >
                                {/* Premium Gradient Background */}
                                <div className="h-full flex flex-col bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
                                    {/* Header with Logo */}
                                    <div className="p-6 pb-4">
                                        <div className="flex items-center justify-between">
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex items-center space-x-3"
                                            >
                                                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
                                                    <Logo className="h-8 w-8" />
                                                </div>
                                                <span className="text-xl font-bold text-white">MarineFrost</span>
                                            </motion.div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="rounded-xl text-white/80 hover:text-white hover:bg-white/10"
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    <nav className="flex-1 px-4 py-2">
                                        <div className="space-y-2">
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                            >
                                                <Link
                                                    href="/dashboard"
                                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === '/dashboard' || pathname?.startsWith('/project')
                                                        ? 'bg-white/20 text-white shadow-lg'
                                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <div className={`p-2 rounded-lg ${pathname === '/dashboard' || pathname?.startsWith('/project')
                                                        ? 'bg-white/20'
                                                        : 'bg-white/10'
                                                        }`}>
                                                        <LayoutDashboard className="h-5 w-5" />
                                                    </div>
                                                    <span className="font-medium">Projects</span>
                                                </Link>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.2 }}
                                            >
                                                <Link
                                                    href="/marinedox"
                                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname?.startsWith('/marinedox')
                                                        ? 'bg-white/20 text-white shadow-lg'
                                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <div className={`p-2 rounded-lg ${pathname?.startsWith('/marinedox')
                                                        ? 'bg-violet-500/30'
                                                        : 'bg-white/10'
                                                        }`}>
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <span className="font-medium">MarineDox</span>
                                                </Link>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.25 }}
                                            >
                                                <Link
                                                    href="/chat"
                                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname?.startsWith('/chat')
                                                        ? 'bg-white/20 text-white shadow-lg'
                                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <div className={`p-2 rounded-lg ${pathname?.startsWith('/chat')
                                                        ? 'bg-blue-500/30'
                                                        : 'bg-white/10'
                                                        }`}>
                                                        <MessageSquare className="h-5 w-5" />
                                                    </div>
                                                    <span className="font-medium">Chat</span>
                                                </Link>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.3 }}
                                            >
                                                <Link
                                                    href="/profile"
                                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === '/profile'
                                                        ? 'bg-white/20 text-white shadow-lg'
                                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <div className={`p-2 rounded-lg ${pathname === '/profile'
                                                        ? 'bg-white/20'
                                                        : 'bg-white/10'
                                                        }`}>
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <span className="font-medium">Profile</span>
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </nav>

                                    {/* User Info Section */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.4 }}
                                        className="p-4 border-t border-white/10"
                                    >
                                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                                            <Avatar className="h-10 w-10 border-2 border-white/20">
                                                <AvatarImage src={user?.avatar} alt={user?.name} />
                                                <AvatarFallback className="bg-white/20 text-white">
                                                    {user?.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white truncate">{user?.name}</p>
                                                <p className="text-xs text-white/60 truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="w-full mt-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl justify-start"
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </Button>
                                    </motion.div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={pathname?.startsWith('/chat') ? 'chat-root' : pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="container mx-auto px-6 py-8 max-w-[1600px]"
                >
                    {children}
                </motion.main>
            </AnimatePresence>
        </div>
    );
}
