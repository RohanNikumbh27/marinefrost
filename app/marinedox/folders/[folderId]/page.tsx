"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useData, DocFolder, MarineDox } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, FileText, Plus, Calendar, User, Trash2, Settings, FolderPlus, Link2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const COLORS = [
    '#0052CC', '#00875A', '#FF5630', '#6554C0', '#FF991F',
    '#00B8D9', '#36B37E', '#FFAB00', '#403294', '#0747A6'
];

const ICONS = ['📁', '📚', '📝', '📋', '🗂️', '📂', '🗃️', '📑', '📊', '🎯'];

export default function FolderDetailPage({ params }: { params: Promise<{ folderId: string }> }) {
    const resolvedParams = use(params);
    const { docFolders, marineDox, projects, updateDocFolder, deleteDocFolder, addDocToFolder, removeDocFromFolder, assignFolderToProject } = useData();
    const router = useRouter();

    const folder = docFolders.find(s => s.id === resolvedParams.folderId);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddDocsOpen, setIsAddDocsOpen] = useState(false);
    const [isAssignProjectOpen, setIsAssignProjectOpen] = useState(false);
    const [editName, setEditName] = useState(folder?.name || '');
    const [editDescription, setEditDescription] = useState(folder?.description || '');
    const [editColor, setEditColor] = useState(folder?.color || COLORS[0]);
    const [editIcon, setEditIcon] = useState(folder?.icon || ICONS[0]);
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

    useEffect(() => {
        if (folder) {
            setEditName(folder.name);
            setEditDescription(folder.description || '');
            setEditColor(folder.color);
            setEditIcon(folder.icon);
        }
    }, [folder]);

    if (!folder) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <h3 className="text-xl mb-2">Folder not found</h3>
                    <Button
                        onClick={() => router.push('/marinedox/folders')}
                        className="rounded-xl"
                        style={{ backgroundColor: 'var(--marinedox-primary)' }}
                    >
                        Back to Folders
                    </Button>
                </div>
            </Layout>
        );
    }

    const folderDocuments = marineDox.filter(doc => folder.documentIds.includes(doc.id));
    const availableDocs = marineDox.filter(doc => !folder.documentIds.includes(doc.id));
    const unassignedProjects = projects.filter(p => !folder.assignedToProjects.includes(p.id));

    const handleSaveEdit = () => {
        updateDocFolder(folder.id, {
            name: editName,
            description: editDescription,
            color: editColor,
            icon: editIcon
        });
        toast.success('Folder updated');
        setIsEditOpen(false);
    };

    const handleDelete = () => {
        deleteDocFolder(folder.id);
        toast.success('Folder deleted');
        router.push('/marinedox/folders');
    };

    const handleAddDocs = () => {
        selectedDocs.forEach(docId => {
            addDocToFolder(folder.id, docId);
        });
        toast.success(`Added ${selectedDocs.length} document(s)`);
        setSelectedDocs([]);
        setIsAddDocsOpen(false);
    };

    const handleRemoveDoc = (docId: string) => {
        removeDocFromFolder(folder.id, docId);
        toast.success('Document removed');
    };

    const handleAssignProject = (projectId: string) => {
        assignFolderToProject(folder.id, projectId);
        toast.success('Assigned to project');
        setIsAssignProjectOpen(false);
    };

    const handleRemoveProject = (projectId: string) => {
        updateDocFolder(folder.id, {
            assignedToProjects: folder.assignedToProjects.filter(id => id !== projectId)
        });
        toast.success('Project unassigned');
    };

    const getProjectName = (projectId: string) => {
        return projects.find(p => p.id === projectId)?.name || 'Unknown';
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div
                    className="p-6 rounded-2xl backdrop-blur-md"
                    style={{
                        backgroundColor: 'var(--marinedox-glass-bg)',
                        border: '1px solid var(--marinedox-glass-border)'
                    }}
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push('/marinedox/folders')}
                                className="rounded-xl"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div
                                className="h-14 w-14 rounded-xl flex items-center justify-center text-3xl"
                                style={{ backgroundColor: `${folder.color}20` }}
                            >
                                {folder.icon}
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold" style={{ color: folder.color }}>
                                    {folder.name}
                                </h1>
                                <p className="text-muted-foreground">{folder.description || 'No description'}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="rounded-xl">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Edit Folder</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-name">Name</Label>
                                            <Input
                                                id="edit-name"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-description">Description</Label>
                                            <Textarea
                                                id="edit-description"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Icon</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {ICONS.map((icon) => (
                                                    <button
                                                        key={icon}
                                                        onClick={() => setEditIcon(icon)}
                                                        className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl transition-all ${editIcon === icon ? 'ring-2 ring-offset-2' : 'hover:bg-muted'}`}
                                                        style={editIcon === icon ? { '--tw-ring-color': editColor } as React.CSSProperties : {}}
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
                                                        onClick={() => setEditColor(color)}
                                                        className={`h-8 w-8 rounded-full transition-all ${editColor === color ? 'ring-2 ring-offset-2' : ''}`}
                                                        style={{ backgroundColor: color, '--tw-ring-color': color } as React.CSSProperties}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSaveEdit} className="rounded-xl" style={{ backgroundColor: editColor }}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="outline"
                                className="rounded-xl text-red-600 hover:bg-red-50"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Assigned Projects */}
                <div
                    className="p-4 rounded-2xl backdrop-blur-md"
                    style={{
                        backgroundColor: 'var(--marinedox-glass-bg)',
                        border: '1px solid var(--marinedox-glass-border)'
                    }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-medium">Assigned Projects</h2>
                        <Dialog open={isAssignProjectOpen} onOpenChange={setIsAssignProjectOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="rounded-xl" disabled={unassignedProjects.length === 0}>
                                    <Link2 className="mr-2 h-4 w-4" />
                                    Assign
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[350px] rounded-2xl">
                                <DialogHeader>
                                    <DialogTitle>Assign to Project</DialogTitle>
                                </DialogHeader>
                                <div className="py-4 space-y-2">
                                    {unassignedProjects.map(project => (
                                        <div
                                            key={project.id}
                                            className="p-3 rounded-xl border cursor-pointer hover:bg-muted transition-colors"
                                            onClick={() => handleAssignProject(project.id)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                    style={{ backgroundColor: project.color }}
                                                >
                                                    {project.key}
                                                </div>
                                                <span>{project.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {folder.assignedToProjects.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No projects assigned</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {folder.assignedToProjects.map(projectId => (
                                <Badge
                                    key={projectId}
                                    className="rounded-full pr-1 flex items-center gap-1"
                                    style={{
                                        backgroundColor: `${folder.color}20`,
                                        color: folder.color
                                    }}
                                >
                                    {getProjectName(projectId)}
                                    <button
                                        onClick={() => handleRemoveProject(projectId)}
                                        className="hover:bg-black/10 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Documents Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">Documents ({folderDocuments.length})</h2>
                        <Dialog open={isAddDocsOpen} onOpenChange={setIsAddDocsOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    className="rounded-xl"
                                    style={{ backgroundColor: folder.color }}
                                    disabled={availableDocs.length === 0}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Documents
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-2xl">
                                <DialogHeader>
                                    <DialogTitle>Add Documents to Folder</DialogTitle>
                                    <DialogDescription>
                                        Select documents to add to {folder.name}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 max-h-[400px] overflow-y-auto space-y-2">
                                    {availableDocs.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">No available documents</p>
                                    ) : (
                                        availableDocs.map(doc => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center space-x-3 p-3 rounded-xl border hover:bg-muted transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setSelectedDocs(prev =>
                                                        prev.includes(doc.id)
                                                            ? prev.filter(id => id !== doc.id)
                                                            : [...prev, doc.id]
                                                    );
                                                }}
                                            >
                                                <Checkbox
                                                    checked={selectedDocs.includes(doc.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedDocs(prev => [...prev, doc.id]);
                                                        } else {
                                                            setSelectedDocs(prev => prev.filter(id => id !== doc.id));
                                                        }
                                                    }}
                                                />
                                                <div
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: 'var(--marinedox-secondary)' }}
                                                >
                                                    <FileText className="h-4 w-4" style={{ color: 'var(--marinedox-primary)' }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{doc.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDocsOpen(false)} className="rounded-xl">
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleAddDocs}
                                        className="rounded-xl"
                                        style={{ backgroundColor: folder.color }}
                                        disabled={selectedDocs.length === 0}
                                    >
                                        Add {selectedDocs.length} Document(s)
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {folderDocuments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center"
                            style={{ borderColor: 'var(--marinedox-glass-border)' }}
                        >
                            <FileText className="h-12 w-12 mb-3" style={{ color: 'var(--marinedox-primary-light)' }} />
                            <h3 className="font-medium mb-1">No documents yet</h3>
                            <p className="text-muted-foreground text-sm">Add documents to this folder to organize them together</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {folderDocuments.map((doc, index) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <Card
                                        className="cursor-pointer rounded-xl transition-all hover:shadow-md group"
                                        style={{
                                            backgroundColor: 'var(--marinedox-glass-bg)',
                                            borderColor: 'var(--marinedox-glass-border)'
                                        }}
                                        onClick={() => router.push(`/marinedox/${doc.id}`)}
                                    >
                                        <CardHeader className="pb-2 flex-row items-start justify-between space-y-0">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: 'var(--marinedox-secondary)' }}
                                                >
                                                    <FileText className="h-5 w-5" style={{ color: 'var(--marinedox-primary)' }} />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base line-clamp-1">{doc.title}</CardTitle>
                                                    <CardDescription className="text-xs">
                                                        {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-lg text-red-600 hover:bg-red-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveDoc(doc.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
