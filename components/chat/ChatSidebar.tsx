
"use client";

import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hash, Lock, Plus, MessageSquare, Circle, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from "sonner"; // Assuming sonner is used as in other parts

export default function ChatSidebar({ onNavigate }: { onNavigate?: () => void }) {
    const { channels, getChannels, createChannel, chatUsers, startDirectMessage } = useData();
    const { user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [newChannelType, setNewChannelType] = useState<"public" | "private">("public");
    const [searchQuery, setSearchQuery] = useState("");

    const userChannels = user ? getChannels(user.id).filter(c => c.type !== 'dm') : [];
    const dmChannels = user ? getChannels(user.id).filter(c => c.type === 'dm') : [];

    // Filtered lists
    const filteredChannels = userChannels.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUsers = chatUsers.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateChannel = () => {
        if (!newChannelName.trim()) return;
        createChannel(newChannelName, "", newChannelType);
        setNewChannelName("");
        setIsCreateOpen(false);
        toast.success("Channel created");
    };

    const handleStartDM = (targetUserId: string) => {
        if (!user) return;
        const channelId = startDirectMessage(user.id, targetUserId);
        router.push(`/chat/${channelId}`);
        onNavigate?.();
    };

    const handleChannelClick = () => {
        onNavigate?.();
    };

    return (
        <div className="w-full h-full flex flex-col bg-background/50 backdrop-blur-md overflow-hidden">
            <div className="p-4 pl-6 shrink-0 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-xl tracking-tight">MarineChat</h2>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-accent">
                                <Plus className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-2xl p-6 sm:rounded-3xl gap-0">
                            <DialogHeader className="mb-6">
                                <DialogTitle className="text-2xl font-bold text-foreground">Create Channel</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-wider">Channel Name</Label>
                                    <Input
                                        id="name"
                                        value={newChannelName}
                                        onChange={(e) => setNewChannelName(e.target.value)}
                                        placeholder="e.g. project-updates"
                                        className="bg-white/50 dark:bg-black/20 border-border/50 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl h-11 px-4 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-wider">Privacy</Label>
                                    <RadioGroup value={newChannelType} onValueChange={(v) => setNewChannelType(v as "public" | "private")} className="grid grid-cols-2 gap-4">
                                        <label className={`cursor-pointer relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all hover:bg-muted/50 ${newChannelType === 'public' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent bg-muted/30'}`}>
                                            <RadioGroupItem value="public" id="public" className="sr-only" />
                                            <div className={`p-3 rounded-full ${newChannelType === 'public' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-background text-muted-foreground'}`}>
                                                <Hash className="h-6 w-6" />
                                            </div>
                                            <div className="text-center">
                                                <div className={`font-semibold text-sm ${newChannelType === 'public' ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>Public</div>
                                                <div className="text-[10px] text-muted-foreground mt-0.5">Joined by anyone</div>
                                            </div>
                                            {newChannelType === 'public' && (
                                                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                            )}
                                        </label>

                                        <label className={`cursor-pointer relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all hover:bg-muted/50 ${newChannelType === 'private' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-transparent bg-muted/30'}`}>
                                            <RadioGroupItem value="private" id="private" className="sr-only" />
                                            <div className={`p-3 rounded-full ${newChannelType === 'private' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-background text-muted-foreground'}`}>
                                                <Lock className="h-6 w-6" />
                                            </div>
                                            <div className="text-center">
                                                <div className={`font-semibold text-sm ${newChannelType === 'private' ? 'text-indigo-700 dark:text-indigo-300' : 'text-foreground'}`}>Private</div>
                                                <div className="text-[10px] text-muted-foreground mt-0.5">Invitation only</div>
                                            </div>
                                            {newChannelType === 'private' && (
                                                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                            )}
                                        </label>
                                    </RadioGroup>
                                </div>
                            </div>
                            <DialogFooter className="mt-8">
                                <Button
                                    onClick={handleCreateChannel}
                                    disabled={!newChannelName.trim()}
                                    className="w-full h-11 rounded-xl bg-black text-white hover:bg-black/90 transition-all font-medium shadow-lg"
                                >
                                    Create Channel
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 rounded-xl bg-background/50 border-transparent focus:bg-background focus:border-input transition-all"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 w-full min-h-0">
                <div className="px-2 pb-4">
                    {/* Channels Section */}
                    {filteredChannels.length > 0 && (
                        <div className="mb-6">
                            <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Channels
                            </h3>
                            <div className="space-y-1">
                                {filteredChannels.map((channel) => (
                                    <Link
                                        key={channel.id}
                                        href={`/chat/${channel.id}`}
                                        onClick={handleChannelClick}
                                    >
                                        <Button
                                            variant={pathname === `/chat/${channel.id}` ? "secondary" : "ghost"}
                                            className="w-full justify-start h-9 px-2"
                                        >
                                            {channel.type === 'private' ? (
                                                <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            ) : (
                                                <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                                            )}
                                            <span className="truncate">{channel.name}</span>
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Direct Messages Section */}
                    {filteredUsers.length > 0 && (
                        <div>
                            <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Direct Messages
                            </h3>
                            <div className="space-y-1">
                                {filteredUsers
                                    .sort((a, b) => {
                                        if (a.id === user?.id) return -1;
                                        if (b.id === user?.id) return 1;
                                        return 0;
                                    })
                                    .map((chatUser) => {
                                        // Find existing DM channel to highlight active state if needed
                                        // For simplicity, we just list users to start/continue DM
                                        const activeDmChannel = dmChannels.find(ch => ch.members.includes(chatUser.id));
                                        const isActive = activeDmChannel && pathname === `/chat/${activeDmChannel.id}`;

                                        const isCurrentUser = chatUser.id === user?.id;
                                        const statusText = chatUser.status.text || chatUser.status.type.charAt(0).toUpperCase() + chatUser.status.type.slice(1);
                                        const statusEmoji = chatUser.status.emoji || '';

                                        return (
                                            <Button
                                                key={chatUser.id}
                                                variant={isActive ? "secondary" : "ghost"}
                                                className="w-full justify-start h-9 px-2 relative"
                                                onClick={() => handleStartDM(chatUser.id)}
                                            >
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="relative mr-2 cursor-pointer">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={chatUser.avatar} />
                                                                    <AvatarFallback className="text-[10px]">{chatUser.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background transition-all duration-300 ${chatUser.status.type === 'online' ? 'bg-green-500' :
                                                                    chatUser.status.type === 'busy' ? 'bg-red-500' :
                                                                        chatUser.status.type === 'meeting' ? 'bg-orange-500' :
                                                                            chatUser.status.type === 'dnd' ? 'bg-red-800' :
                                                                                chatUser.status.type === 'lunch' ? 'bg-pink-500' : 'bg-gray-400'
                                                                    }`} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent
                                                            side="top"
                                                            showArrow={false}
                                                            className="flex items-center gap-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-2.5 shadow-xl min-h-[40px] animate-in slide-in-from-bottom-2 duration-300"
                                                            sideOffset={16}
                                                        >
                                                            <span className="text-xl leading-none filter drop-shadow-sm">{statusEmoji}</span>
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="text-sm font-semibold text-foreground leading-tight">{statusText}</span>
                                                                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">
                                                                    {chatUser.status.type}
                                                                </span>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <span className="truncate flex items-center gap-2">
                                                    {chatUser.name}
                                                    {isCurrentUser && <span className="text-xs text-muted-foreground/70 font-normal">(Note to self)</span>}
                                                </span>
                                            </Button>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
