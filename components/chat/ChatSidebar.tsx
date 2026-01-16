"use client";

import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hash, Lock, Plus, MessageSquare, Circle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner"; // Assuming sonner is used as in other parts

export default function ChatSidebar() {
    const { channels, getChannels, createChannel, chatUsers, startDirectMessage } = useData();
    const { user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [newChannelType, setNewChannelType] = useState<"public" | "private">("public");

    const userChannels = user ? getChannels(user.id).filter(c => c.type !== 'dm') : [];
    const dmChannels = user ? getChannels(user.id).filter(c => c.type === 'dm') : [];

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
    };

    return (
        <div className="w-64 border-r h-full flex flex-col bg-background/50 backdrop-blur-md">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-lg">MarineChat</h2>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Plus className="h-4 w-4" />
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

            <ScrollArea className="flex-1 px-2 py-4">
                <div className="mb-6">
                    <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Channels
                    </h3>
                    <div className="space-y-1">
                        {userChannels.map((channel) => (
                            <Link
                                key={channel.id}
                                href={`/chat/${channel.id}`}
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

                {/* Direct Messages */}
                <div>
                    <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Direct Messages
                    </h3>
                    <div className="space-y-1">
                        {chatUsers.map((chatUser) => {
                            // Find existing DM channel to highlight active state if needed
                            // For simplicity, we just list users to start/continue DM
                            const activeDmChannel = dmChannels.find(ch => ch.members.includes(chatUser.id));
                            const isActive = activeDmChannel && pathname === `/chat/${activeDmChannel.id}`;

                            return (
                                <Button
                                    key={chatUser.id}
                                    variant={isActive ? "secondary" : "ghost"}
                                    className="w-full justify-start h-9 px-2 relative"
                                    onClick={() => handleStartDM(chatUser.id)}
                                >
                                    <div className="relative mr-2">
                                        <Avatar className="h-4 w-4">
                                            <AvatarImage src={chatUser.avatar} />
                                            <AvatarFallback className="text-[10px]">{chatUser.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-background ${chatUser.status === 'online' ? 'bg-green-500' :
                                                chatUser.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                                            }`} />
                                    </div>
                                    <span className="truncate">{chatUser.name}</span>
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
