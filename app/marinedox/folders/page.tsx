"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useData, DocFolder } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FolderOpen, Plus, Search, Calendar, User, FileText, MoreVertical, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const COLORS = [
    '#0052CC', '#00875A', '#FF5630', '#6554C0', '#FF991F',
    '#00B8D9', '#36B37E', '#FFAB00', '#403294', '#0747A6'
];

const ICONS = ['📁', '📚', '📝', '📋', '🗂️', '📂', '🗃️', '📑', '📊', '🎯'];

export default function FoldersPage() {
    const { docFolders, projects, marineDox, addDocFolder, deleteDocFolder } = useData();
    const { user } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterProject, setFilterProject] = useState<string>('all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderDescription, setNewFolderDescription] = useState('');
    const [newFolderColor, setNewFolderColor] = useState(COLORS[0]);
    const [newFolderIcon, setNewFolderIcon] = useState(ICONS[0]);

    const filteredFolders = docFolders
        .filter(folder =>
            folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (folder.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        )
        .filter(folder => filterProject === 'all' || folder.assignedToProjects.includes(filterProject));

    const getProjectName = (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        return project?.name || 'Unknown Project';
    };

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) {
            toast.error('Please enter a folder name');
            return;
        }

        addDocFolder({
            name: newFolderName,
            description: newFolderDescription,
            icon: newFolderIcon,
            color: newFolderColor,
            documentIds: [],
            assignedToProjects: [],
            assignedToTasks: [],
            author: {
                id: user?.id || '1',
                name: user?.name || 'Anonymous',
                avatar: user?.avatar
            }
        });

        toast.success('Folder created!');
        setNewFolderName('');
        setNewFolderDescription('');
        setNewFolderColor(COLORS[0]);
        setNewFolderIcon(ICONS[0]);
        setIsCreateOpen(false);
    };

    const handleDeleteFolder = (id: string) => {
        deleteDocFolder(id);
        toast.success('Folder deleted');
    };

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold" style={{ color: 'var(--marinedox-primary)' }}>
                            Folders
                        </h1>
                        <p className="text-muted-foreground">Organize your documents into collections</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="rounded-xl"
                                style={{ backgroundColor: 'var(--marinedox-primary)' }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                New Folder
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-2xl">
                            <DialogHeader>
                                <DialogTitle>Create Folder</DialogTitle>
                                <DialogDescription>
                                    Create a new folder for your documents
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Sprint Documentation"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Brief description of this folder..."
                                        value={newFolderDescription}
                                        onChange={(e) => setNewFolderDescription(e.target.value)}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Icon</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {ICONS.map((icon) => (
                                            <button
                                                key={icon}
                                                onClick={() => setNewFolderIcon(icon)}
                                                className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl transition-all ${newFolderIcon === icon
                                                    ? 'ring-2 ring-offset-2'
                                                    : 'hover:bg-muted'
                                                    }`}
                                                style={newFolderIcon === icon ? { '--tw-ring-color': newFolderColor } as React.CSSProperties : {}}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Color</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {COLORS.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setNewFolderColor(color)}
                                                className={`h-8 w-8 rounded-full transition-all ${newFolderColor === color
                                                    ? 'ring-2 ring-offset-2'
                                                    : ''
                                                    }`}
                                                style={{ backgroundColor: color, '--tw-ring-color': color } as React.CSSProperties}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateFolder}
                                    className="rounded-xl"
                                    style={{ backgroundColor: newFolderColor }}
                                >
                                    Create Folder
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search & Filter */}
                <div
                    className="p-4 rounded-2xl backdrop-blur-md"
                    style={{
                        backgroundColor: 'var(--marinedox-glass-bg)',
                        border: '1px solid var(--marinedox-glass-border)'
                    }}
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search folders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-xl border-0 ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-background/50"
                            />
                        </div>
                        <Select value={filterProject} onValueChange={setFilterProject}>
                            <SelectTrigger className="w-full md:w-[200px] rounded-xl">
                                <SelectValue placeholder="All Projects" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Projects</SelectItem>
                                {projects.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Folders Grid */}
                {filteredFolders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <FolderOpen className="h-16 w-16 mb-4" style={{ color: 'var(--marinedox-primary-light)' }} />
                        <h3 className="text-xl mb-2">No folders yet</h3>
                        <p className="text-muted-foreground mb-6">Create your first folder to organize your docs</p>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="rounded-xl"
                            style={{ backgroundColor: 'var(--marinedox-primary)' }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Folder
                        </Button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFolders.map((folder, index) => (
                            <motion.div
                                key={folder.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className="cursor-pointer h-full rounded-2xl transition-all duration-300 hover:shadow-lg backdrop-blur-md group"
                                    style={{
                                        backgroundColor: 'var(--marinedox-glass-bg)',
                                        borderColor: 'var(--marinedox-glass-border)'
                                    }}
                                    onClick={() => router.push(`/marinedox/folders/${folder.id}`)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div
                                                className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl"
                                                style={{ backgroundColor: `${folder.color}20` }}
                                            >
                                                {folder.icon}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl h-8 w-8"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl">
                                                    <DropdownMenuItem
                                                        className="rounded-lg"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/marinedox/folders/${folder.id}`);
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="rounded-lg text-red-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteFolder(folder.id);
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <CardTitle className="line-clamp-1 mt-3" style={{ color: folder.color }}>
                                            {folder.name}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {folder.description || 'No description'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                            <div className="flex items-center space-x-1">
                                                <FileText className="h-3 w-3" />
                                                <span>{folder.documentIds.length} documents</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDistanceToNow(new Date(folder.updatedAt), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                        {folder.assignedToProjects.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {folder.assignedToProjects.slice(0, 2).map((projectId) => (
                                                    <Badge
                                                        key={projectId}
                                                        className="rounded-full text-xs"
                                                        style={{
                                                            backgroundColor: `${folder.color}20`,
                                                            color: folder.color
                                                        }}
                                                    >
                                                        {getProjectName(projectId)}
                                                    </Badge>
                                                ))}
                                                {folder.assignedToProjects.length > 2 && (
                                                    <Badge
                                                        className="rounded-full text-xs"
                                                        style={{
                                                            backgroundColor: `${folder.color}20`,
                                                            color: folder.color
                                                        }}
                                                    >
                                                        +{folder.assignedToProjects.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
