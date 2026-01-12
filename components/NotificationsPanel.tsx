"use client";

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, AlertCircle, Info, Calendar, GitBranch, Users, Trash2, CheckCheck, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsPanelProps {
    onClose?: () => void;
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useData();
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationClick = (notification: any) => {
        markNotificationAsRead(notification.id);
        if (notification.link) {
            router.push(notification.link);
            onClose?.();
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-600" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-600" />;
            case 'task':
                return <CheckCircle className="h-5 w-5 text-purple-600" />;
            case 'sprint':
                return <GitBranch className="h-5 w-5 text-orange-600" />;
            case 'calendar':
                return <Calendar className="h-5 w-5 text-cyan-600" />;
            case 'team':
                return <Users className="h-5 w-5 text-pink-600" />;
            default:
                return <Bell className="h-5 w-5 text-gray-600" />;
        }
    };

    const getNotificationBg = (type: string, isRead: boolean) => {
        if (isRead) return 'bg-background';

        switch (type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-950/20';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-950/20';
            case 'info':
                return 'bg-blue-50 dark:bg-blue-950/20';
            case 'task':
                return 'bg-purple-50 dark:bg-purple-950/20';
            case 'sprint':
                return 'bg-orange-50 dark:bg-orange-950/20';
            case 'calendar':
                return 'bg-cyan-50 dark:bg-cyan-950/20';
            case 'team':
                return 'bg-pink-50 dark:bg-pink-950/20';
            default:
                return 'bg-gray-50 dark:bg-gray-950/20';
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">Notifications</h2>
                        {unreadCount > 0 && (
                            <Badge className="rounded-full" variant="default">
                                {unreadCount}
                            </Badge>
                        )}
                    </div>
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">Stay updated with your project activities</p>
                {notifications.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllNotificationsAsRead}
                        className="rounded-lg mt-3 w-full"
                    >
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-hidden p-6">
                <Tabs defaultValue="all" className="h-full flex flex-col">
                    <TabsList className="rounded-xl w-full grid grid-cols-2">
                        <TabsTrigger
                            value="all"
                            className="rounded-lg"
                            onClick={() => setFilter('all')}
                        >
                            All ({notifications.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="unread"
                            className="rounded-lg"
                            onClick={() => setFilter('unread')}
                        >
                            Unread ({unreadCount})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="flex-1 mt-6 overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                            {filteredNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Bell className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                                    <p className="text-muted-foreground">No notifications</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        You&apos;re all caught up!
                                    </p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    <div className="space-y-3">
                                        {filteredNotifications.map((notification) => (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.2 }}
                                                className={`group relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${getNotificationBg(notification.type, notification.read)
                                                    } ${!notification.read ? 'border-primary/50' : ''}`}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className="mt-0.5">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <div className="flex items-start justify-between">
                                                            <p className="font-medium">{notification.title}</p>
                                                            {!notification.read && (
                                                                <div className="h-2 w-2 bg-blue-600 rounded-full ml-2 mt-1.5 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <p className="text-xs text-muted-foreground">
                                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                            </p>
                                                            {notification.category && (
                                                                <Badge variant="outline" className="text-xs rounded-md">
                                                                    {notification.category}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg h-8 w-8"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification.id);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </AnimatePresence>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="unread" className="flex-1 mt-6 overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                            {filteredNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                                    <p className="text-muted-foreground">No unread notifications</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        You&apos;re all caught up!
                                    </p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    <div className="space-y-3">
                                        {filteredNotifications.map((notification) => (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.2 }}
                                                className={`group relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${getNotificationBg(notification.type, notification.read)
                                                    } ${!notification.read ? 'border-primary/50' : ''}`}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className="mt-0.5">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <div className="flex items-start justify-between">
                                                            <p className="font-medium">{notification.title}</p>
                                                            {!notification.read && (
                                                                <div className="h-2 w-2 bg-blue-600 rounded-full ml-2 mt-1.5 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <p className="text-xs text-muted-foreground">
                                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                            </p>
                                                            {notification.category && (
                                                                <Badge variant="outline" className="text-xs rounded-md">
                                                                    {notification.category}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg h-8 w-8"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification.id);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </AnimatePresence>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
