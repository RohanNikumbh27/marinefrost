
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
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Channel</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={newChannelName}
                                        onChange={(e) => setNewChannelName(e.target.value)}
                                        placeholder="e.g. project-updates"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Type</Label>
                                    <RadioGroup value={newChannelType} onValueChange={(v) => setNewChannelType(v as "public" | "private")}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="public" id="public" />
                                            <Label htmlFor="public">Public - joined by anyone</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="private" id="private" />
                                            <Label htmlFor="private">Private - invitation only</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateChannel}>Create Channel</Button>
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
