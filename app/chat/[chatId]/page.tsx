"use client";

import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hash, Send, User, Paperclip, Image as ImageIcon, FileText, CheckSquare, X, Plus } from "lucide-react";
import React, { useState, useEffect, useRef, use } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Attachment } from "@/contexts/DataContext";

export default function ChatDetailPage({ params }: { params: Promise<{ chatId: string }> }) {
    const resolvedParams = use(params);
    const { channels, messages, sendMessage, getMessages, chatUsers, marineDox, tasks: allTasks } = useData();
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState("");
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isMarineDoxOpen, setIsMarineDoxOpen] = useState(false);
    const [isTasksOpen, setIsTasksOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const channel = channels.find(c => c.id === resolvedParams.chatId);
    const channelMessages = getMessages(resolvedParams.chatId);

    // Helper to get target user for DMs
    const targetUser = (() => {
        if (!channel || channel.type !== 'dm' || !user) return undefined;
        const otherMemberId = channel.members.find(id => id !== user.id);
        const targetId = otherMemberId || user.id;
        return chatUsers.find(u => u.id === targetId);
    })();

    const displayName = (() => {
        if (!channel) return "";
        if (channel.type !== 'dm') return channel.name;
        if (targetUser && targetUser.id === user?.id) return "Note to Self";
        return targetUser ? targetUser.name : "Unknown User";
    })();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [channelMessages, attachments]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!newMessage.trim() && attachments.length === 0) || !user) return;

        sendMessage(newMessage, resolvedParams.chatId, user.id, 'text', attachments);
        setNewMessage("");
        setAttachments([]);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isImage = file.type.startsWith('image/');
        const newAttachment: Attachment = {
            id: Math.random().toString(36).substr(2, 9),
            type: isImage ? 'image' : 'file',
            name: file.name,
            url: URL.createObjectURL(file), // In real app, upload to server
            preview: isImage ? URL.createObjectURL(file) : undefined
        };

        setAttachments([...attachments, newAttachment]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const addMarineDoxAttachment = (doc: any) => {
        const newAttachment: Attachment = {
            id: doc.id,
            type: 'marinedox',
            name: doc.title,
            url: `/marinedox/${doc.id}`
        };
        setAttachments([...attachments, newAttachment]);
        setIsMarineDoxOpen(false);
    };

    const addTaskAttachment = (task: any) => {
        const newAttachment: Attachment = {
            id: task.id,
            type: 'task',
            name: task.key + ': ' + task.title,
            url: `/project/${task.projectId}/sprint/${task.sprintId}?taskId=${task.id}`
        };
        setAttachments([...attachments, newAttachment]);
        setIsTasksOpen(false);
    };

    const removeAttachment = (id: string) => {
        setAttachments(attachments.filter(a => a.id !== id));
    };

    if (!channel) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                Channel not found
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-background/50 backdrop-blur-sm">
            {/* Header - hidden on mobile since layout has header */}
            <div className="hidden md:flex h-14 border-b items-center px-4 bg-background/50 backdrop-blur-md shrink-0">
                {channel.type === 'dm' ? (
                    <>
                        {(() => {
                            const otherUserId = channel.members.find(id => id !== user?.id);
                            const targetId = otherUserId || user?.id; // Fallback to self
                            const otherUser = chatUsers.find(u => u.id === targetId);
                            if (otherUser) {
                                const statusEmoji = otherUser.status.emoji || (
                                    otherUser.status.type === 'online' ? '🟢' :
                                        otherUser.status.type === 'busy' ? '🔴' :
                                            otherUser.status.type === 'meeting' ? '📅' :
                                                otherUser.status.type === 'dnd' ? '⛔' :
                                                    otherUser.status.type === 'lunch' ? '🍽️' :
                                                        otherUser.status.type === 'offline' ? '⚫' : '✏️'
                                );
                                const statusText = otherUser.status.text || (
                                    otherUser.status.type.charAt(0).toUpperCase() + otherUser.status.type.slice(1)
                                );
                                return (
                                    <TooltipProvider delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="relative mr-2 cursor-pointer">
                                                    <User className="h-5 w-5 text-muted-foreground" />
                                                    <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background ${otherUser.status.type === 'online' ? 'bg-green-500' :
                                                        otherUser.status.type === 'busy' ? 'bg-red-500' :
                                                            otherUser.status.type === 'meeting' ? 'bg-orange-500' :
                                                                otherUser.status.type === 'dnd' ? 'bg-red-800' :
                                                                    otherUser.status.type === 'lunch' ? 'bg-pink-500' : 'bg-gray-400'
                                                        }`} />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="bottom"
                                                showArrow={false}
                                                className="flex items-center gap-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-2.5 shadow-xl min-h-[40px] animate-in slide-in-from-top-2 duration-300"
                                                sideOffset={12}
                                            >
                                                <span className="text-xl leading-none filter drop-shadow-sm">{statusEmoji}</span>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-semibold text-foreground leading-tight">{statusText}</span>
                                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{otherUser.status.type}</span>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            }
                            return <User className="h-5 w-5 mr-2 text-muted-foreground" />;
                        })()}
                    </>
                ) : (
                    <Hash className="h-5 w-5 mr-2 text-muted-foreground" />
                )}
                <div>
                    <h2 className="font-semibold">{displayName}</h2>
                    {channel.description && channel.type !== 'dm' && (
                        <p className="text-xs text-muted-foreground">{channel.description}</p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0 p-2 md:p-4">
                <div className="space-y-4">
                    {channelMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in-50 duration-500">
                            {channel.type === 'dm' && targetUser ? (
                                <div className="relative mb-6">
                                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                        <AvatarImage src={targetUser.avatar} />
                                        <AvatarFallback className="text-3xl bg-muted">{displayName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-background ${targetUser.status.type === 'online' ? 'bg-green-500' :
                                        targetUser.status.type === 'busy' ? 'bg-red-500' :
                                            targetUser.status.type === 'meeting' ? 'bg-orange-500' :
                                                targetUser.status.type === 'dnd' ? 'bg-red-800' :
                                                    targetUser.status.type === 'lunch' ? 'bg-pink-500' : 'bg-gray-400'
                                        }`} />
                                </div>
                            ) : (
                                <div className="h-20 w-20 bg-muted/40 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                                    <Hash className="h-10 w-10 text-muted-foreground/50" />
                                </div>
                            )}

                            <div className="space-y-2 max-w-md">
                                <h3 className="text-2xl font-bold tracking-tight">{displayName}</h3>
                                <p className="text-muted-foreground">
                                    {channel.type === 'dm'
                                        ? `This is the beginning of your conversation with ${displayName}.`
                                        : `Welcome to the beginning of the #${displayName} channel.`
                                    }
                                </p>
                            </div>

                            {channel.type === 'dm' && (
                                <Button
                                    className="mt-8 rounded-xl"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()} // Trigger something or just visual
                                >
                                    Say Hello 👋
                                </Button>
                            )}
                        </div>
                    ) : (
                        channelMessages.map((msg, index) => {
                            const isMe = msg.senderId === user?.id;
                            const showAvatar = index === 0 || channelMessages[index - 1].senderId !== msg.senderId;

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                                >
                                    {showAvatar && channel.type !== 'dm' ? (
                                        <Avatar className="h-8 w-8 mt-1">
                                            {/* In a real app we'd lookup the sender's details */}
                                            <AvatarFallback className={isMe ? "bg-primary text-primary-foreground" : ""}>
                                                {isMe ? "Me" : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : channel.type !== 'dm' ? (
                                        <div className="w-8" />
                                    ) : null}
                                    <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                        {showAvatar && !isMe && channel.type !== 'dm' && (
                                            <span className="text-xs text-muted-foreground ml-1 mb-1">
                                                User {msg.senderId.slice(0, 4)}
                                            </span>
                                        )}
                                        <div
                                            className={`px-3 py-2 rounded-2xl text-sm ${isMe
                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                : "bg-muted text-foreground rounded-tl-sm"
                                                }`}
                                        >
                                            {msg.content}

                                            {/* Attachments Rendering */}
                                            {msg.attachments && msg.attachments.length > 0 && (
                                                <div className={`mt-2 space-y-2 ${isMe ? "items-end" : "items-start"}`}>
                                                    {msg.attachments.map(att => (
                                                        <div key={att.id} className="max-w-[200px]">
                                                            {att.type === 'image' ? (
                                                                <img src={att.url || att.preview} alt={att.name} className="rounded-lg border bg-background" />
                                                            ) : (
                                                                <div className={`flex items-center p-2 rounded-lg text-xs gap-2 border ${isMe ? "bg-primary-foreground/10 border-primary-foreground/20" : "bg-background border-border"
                                                                    }`}>
                                                                    {att.type === 'marinedox' && <FileText className="h-4 w-4 shrink-0" />}
                                                                    {att.type === 'task' && <CheckSquare className="h-4 w-4 shrink-0" />}
                                                                    {att.type === 'file' && <Paperclip className="h-4 w-4 shrink-0" />}
                                                                    <span className="truncate">{att.name}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input with Attachments, Unified Style */}
            <div className="px-2 pt-2 pb-0 md:p-4 md:pt-2 bg-background/50 backdrop-blur-md shrink-0">
                <div className="bg-muted/50 rounded-2xl border border-transparent focus-within:border-primary/20 transition-all overflow-hidden shadow-sm">

                    {/* Pending Attachments Preview */}
                    {attachments.length > 0 && (
                        <div className="flex gap-1.5 md:gap-2 overflow-x-auto p-2 md:p-3 pb-0 scrollbar-hide">
                            {attachments.map(att => (
                                <div key={att.id} className="relative group shrink-0 bg-background/60 rounded-full pl-1 pr-8 py-1 flex items-center gap-2 border shadow-sm max-w-[180px] hover:bg-background/80 transition-colors">
                                    {att.type === 'image' ? (
                                        <div className="h-6 w-6 rounded-full overflow-hidden bg-muted shrink-0">
                                            <img src={att.url || att.preview} alt={att.name} className="h-full w-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            {att.type === 'marinedox' && <FileText className="h-3 w-3" />}
                                            {att.type === 'task' && <CheckSquare className="h-3 w-3" />}
                                            {att.type === 'file' && <Paperclip className="h-3 w-3" />}
                                        </div>
                                    )}
                                    <span className="text-xs truncate font-medium text-foreground/80">{att.name}</span>
                                    <button
                                        onClick={() => removeAttachment(att.id)}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-end p-2 gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full shrink-0 text-muted-foreground hover:text-foreground hover:bg-background/20 transition-colors">
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                                    <ImageIcon className="mr-2 h-4 w-4" /> Image/File
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsMarineDoxOpen(true)}>
                                    <FileText className="mr-2 h-4 w-4" /> MarineDox
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsTasksOpen(true)}>
                                    <CheckSquare className="mr-2 h-4 w-4" /> Task
                                </DropdownMenuItem>
                            </DropdownMenuContent>

                        </DropdownMenu>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                            multiple={false} // Simplify for now
                        />

                        <form onSubmit={handleSendMessage} className="flex-1 flex items-end gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={`Message ${channel.type === 'dm' ? displayName : '#' + channel.name}`}
                                className="bg-transparent border-0 focus-visible:ring-0 px-2 py-0 h-9 min-h-[36px]"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!newMessage.trim() && attachments.length === 0}
                                className={`h-9 w-9 rounded-lg shrink-0 transition-all ${newMessage.trim() || attachments.length > 0 ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/40 text-muted-foreground"
                                    }`}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Dialogs for Selecting MarineDox/Tasks */}
            <Dialog open={isMarineDoxOpen} onOpenChange={setIsMarineDoxOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Attach MarineDox</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[300px]">
                        <div className="space-y-1 p-1">
                            {marineDox.map(doc => (
                                <Button key={doc.id} variant="ghost" className="w-full justify-start" onClick={() => addMarineDoxAttachment(doc)}>
                                    <FileText className="mr-2 h-4 w-4" /> {doc.title}
                                </Button>
                            ))}
                            {marineDox.length === 0 && <p className="text-center text-muted-foreground py-4">No documents found.</p>}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <Dialog open={isTasksOpen} onOpenChange={setIsTasksOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Attach Task</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[300px]">
                        <div className="space-y-1 p-1">
                            {allTasks.map((task: any) => (
                                <Button key={task.id} variant="ghost" className="w-full justify-start" onClick={() => addTaskAttachment(task)}>
                                    <CheckSquare className="mr-2 h-4 w-4" /> {task.key}: {task.title}
                                </Button>
                            ))}
                            {allTasks.length === 0 && <p className="text-center text-muted-foreground py-4">No tasks found.</p>}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
