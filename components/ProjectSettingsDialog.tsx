"use client";

import { useState } from 'react';
import { useData, Project } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserPlus, Trash2, Shield, ShieldAlert, Ban } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project;
}

export default function ProjectSettingsDialog({ open, onOpenChange, project }: ProjectSettingsDialogProps) {
    const { updateProject } = useData();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);

    // General Form State
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description);
    const [key, setKey] = useState(project.key);

    // Invite Member State
    const [inviteEmail, setInviteEmail] = useState('');

    // Check if current user is admin
    const currentUserRole = project.members.find(m => m.id === user?.id)?.role;
    const isAdmin = currentUserRole === 'Admin' || currentUserRole === 'Product Manager'; // Assuming PM is admin-like

    const handleGeneralSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        updateProject(project.id, { name, description, key });
        toast.success('Project settings updated');
        setLoading(false);
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

        // Simulate adding member
        const newMember = {
            id: `user_${Date.now()}`,
            name: inviteEmail.split('@')[0], // Simple name derivation
            email: inviteEmail,
            avatar: '',
            role: 'Member'
        };

        updateProject(project.id, {
            members: [...project.members, newMember]
        });

        setInviteEmail('');
        toast.success(`Invited ${inviteEmail} to the project`);
        setLoading(false);
    };

    const handleRemoveMember = (memberId: string) => {
        if (memberId === user?.id) {
            toast.error("You cannot remove yourself. Leave project instead.");
            return;
        }
        const updatedMembers = project.members.filter(m => m.id !== memberId);
        updateProject(project.id, { members: updatedMembers });
        toast.success('Member removed');
    };

    const handleRoleChange = (memberId: string, newRole: string) => {
        const updatedMembers = project.members.map(m =>
            m.id === memberId ? { ...m, role: newRole } : m
        );
        updateProject(project.id, { members: updatedMembers });
        toast.success('Role updated');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] rounded-2xl h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2 border-b">
                    <DialogTitle>Project Settings</DialogTitle>
                    <DialogDescription>
                        Manage your project configuration and team members.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 pt-2 pb-0">
                        <TabsList className="w-full justify-start rounded-xl bg-muted/50 p-1">
                            <TabsTrigger value="general" className="rounded-lg flex-1">General</TabsTrigger>
                            <TabsTrigger value="team" className="rounded-lg flex-1">Team & Roles</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 pt-4">
                        <TabsContent value="general" className="mt-0 space-y-4 focus-visible:ring-0">
                            <form onSubmit={handleGeneralSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Project Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="rounded-xl"
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="key">Project Key</Label>
                                    <Input
                                        id="key"
                                        value={key}
                                        onChange={e => setKey(e.target.value)}
                                        className="rounded-xl font-mono uppercase"
                                        maxLength={5}
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="desc">Description</Label>
                                    <Textarea
                                        id="desc"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="rounded-xl resize-none"
                                        rows={4}
                                        disabled={!isAdmin}
                                    />
                                </div>
                                {isAdmin && (
                                    <div className="pt-2 flex justify-end">
                                        <Button type="submit" disabled={loading} className="rounded-xl">
                                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                )}
                                {!isAdmin && (
                                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm flex items-center">
                                        <Ban className="h-4 w-4 mr-2" />
                                        Only project admins can edit these settings.
                                    </div>
                                )}
                            </form>
                        </TabsContent>

                        <TabsContent value="team" className="mt-0 space-y-6 focus-visible:ring-0">
                            {/* Invite Section */}
                            {isAdmin && (
                                <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                                    <h4 className="font-medium text-sm">Valid Email Invitation</h4>
                                    <form onSubmit={handleInvite} className="flex gap-2">
                                        <Input
                                            placeholder="colleague@company.com"
                                            value={inviteEmail}
                                            onChange={e => setInviteEmail(e.target.value)}
                                            className="rounded-xl bg-background"
                                            type="email"
                                        />
                                        <Button type="submit" disabled={loading || !inviteEmail} className="rounded-xl shrink-0">
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Invite
                                        </Button>
                                    </form>
                                </div>
                            )}

                            <div className="space-y-3">
                                <h4 className="font-medium text-sm">Team Members ({project.members.length})</h4>
                                <div className="space-y-2">
                                    {project.members.map(member => (
                                        <div key={member.id} className="flex items-center justify-between p-3 rounded-xl border bg-card">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border">
                                                    <AvatarImage src={member.avatar} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{member.name}</p>
                                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isAdmin ? (
                                                    <Select
                                                        value={member.role}
                                                        onValueChange={(val) => handleRoleChange(member.id, val)}
                                                        disabled={loading || member.id === user?.id} // Can't change own role to lock out? actually maybe allow but warn
                                                    >
                                                        <SelectTrigger className="w-[110px] h-8 rounded-lg text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent align="end">
                                                            <SelectItem value="Admin">Admin</SelectItem>
                                                            <SelectItem value="Product Manager">Manager</SelectItem>
                                                            <SelectItem value="Developer">Developer</SelectItem>
                                                            <SelectItem value="Designer">Designer</SelectItem>
                                                            <SelectItem value="Viewer">Viewer</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Badge variant="secondary" className="rounded-full">
                                                        {member.role}
                                                    </Badge>
                                                )}

                                                {isAdmin && member.id !== user?.id && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-red-500 rounded-lg"
                                                        onClick={() => handleRemoveMember(member.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
