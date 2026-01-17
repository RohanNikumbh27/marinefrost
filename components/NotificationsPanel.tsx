"use client";

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useRouter } from 'next/navigation';
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
                return <CheckCircle className="h-5 w-5 text-emerald-500" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-amber-500" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-500" />;
            case 'task':
                return <CheckCircle className="h-5 w-5 text-violet-500" />;
            case 'sprint':
                return <GitBranch className="h-5 w-5 text-orange-500" />;
            case 'calendar':
                return <Calendar className="h-5 w-5 text-cyan-500" />;
            case 'team':
                return <Users className="h-5 w-5 text-pink-500" />;
            default:
                return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-emerald-50 dark:bg-emerald-500/10';
            case 'warning':
                return 'bg-amber-50 dark:bg-amber-500/10';
            case 'info':
                return 'bg-blue-50 dark:bg-blue-500/10';
            case 'task':
                return 'bg-violet-50 dark:bg-violet-500/10';
            case 'sprint':
                return 'bg-orange-50 dark:bg-orange-500/10';
            case 'calendar':
                return 'bg-cyan-50 dark:bg-cyan-500/10';
            case 'team':
                return 'bg-pink-50 dark:bg-pink-500/10';
            default:
                return 'bg-gray-100 dark:bg-gray-500/10';
        }
    };

    const NotificationCard = ({ notification }: { notification: any }) => (
        <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
            className={`
                group relative p-5 rounded-2xl bg-card
                shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
                ${!notification.read ? 'ring-1 ring-primary/20' : ''}
            `}
            onClick={() => handleNotificationClick(notification)}
        >
            <div className="flex items-start gap-4">
                {/* Round icon container */}
                <div className={`
                    flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center
                    ${getIconBg(notification.type)}
                `}>
                    {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-foreground leading-tight">
                            {notification.title}
                        </h4>
                        {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        {notification.category && (
                            <Badge
                                variant="secondary"
                                className="text-xs rounded-full px-3 py-0.5 font-medium bg-muted"
                            >
                                {notification.category}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Delete button - only on hover */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl h-8 w-8 absolute top-3 right-3"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                    }}
                >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
            </div>
        </motion.div>
    );

    return (
        <div className="h-full flex flex-col bg-muted/30">
            {/* Header */}
            <div className="p-6 bg-background border-b">
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
                        className="rounded-xl mt-3 w-full"
                    >
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden p-6">
                <Tabs defaultValue="all" className="h-full flex flex-col">
                    <TabsList className="rounded-xl w-full grid grid-cols-2 bg-background">
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
                        <ScrollArea className="h-full pr-2">
                            {filteredNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                                        <Bell className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-muted-foreground font-medium">No notifications</p>
                                    <p className="text-sm text-muted-foreground/70 mt-1">
                                        You&apos;re all caught up!
                                    </p>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    <div className="space-y-4">
                                        {filteredNotifications.map((notification) => (
                                            <NotificationCard key={notification.id} notification={notification} />
                                        ))}
                                    </div>
                                </AnimatePresence>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="unread" className="flex-1 mt-6 overflow-hidden">
                        <ScrollArea className="h-full pr-2">
                            {filteredNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
                                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                                    </div>
                                    <p className="text-muted-foreground font-medium">All caught up!</p>
                                    <p className="text-sm text-muted-foreground/70 mt-1">
                                        No unread notifications
                                    </p>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    <div className="space-y-4">
                                        {filteredNotifications.map((notification) => (
                                            <NotificationCard key={notification.id} notification={notification} />
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
