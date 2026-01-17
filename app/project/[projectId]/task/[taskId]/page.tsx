"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { useData, Task } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, FileText, ArrowLeft, FolderOpen, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function TaskDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { projectId, taskId } = params as { projectId: string; taskId: string };
    const { projects, updateTask, deleteTask, marineDox, docFolders, assignDocToTask, assignFolderToTask } = useData();

    const [task, setTask] = useState<Task | null>(null);
    const [sprintId, setSprintId] = useState<string>('');
    const [projectKey, setProjectKey] = useState<string>('');
    const [members, setMembers] = useState<Array<{ id: string; name: string; avatar: string }>>([]);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'task' as Task['type'],
        status: 'todo' as Task['status'],
        priority: 'medium' as Task['priority'],
        assigneeId: '',
        storyPoints: 0,
        dueDate: undefined as Date | undefined,
        tags: [] as string[]
    });
    const [tagInput, setTagInput] = useState('');
    const [attachedDocIds, setAttachedDocIds] = useState<string[]>([]);
    const [attachedFolderIds, setAttachedFolderIds] = useState<string[]>([]);

    useEffect(() => {
        if (projectId && taskId && projects.length > 0) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                setProjectKey(project.key);
                setMembers(project.members);

                // Find task and sprint
                for (const sprint of project.sprints) {
                    const foundTask = sprint.tasks.find(t => t.id === taskId);
                    if (foundTask) {
                        setTask(foundTask);
                        setSprintId(sprint.id);
                        break;
                    }
                }
            }
        }
    }, [projectId, taskId, projects]);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                type: task.type,
                status: task.status,
                priority: task.priority,
                assigneeId: task.assignee?.id || '',
                storyPoints: task.storyPoints,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                tags: task.tags || []
            });
            // In a real app we'd load attached docs here, for now local state initialization needs logic if preserved
            // Simulating "already attached" check logic relies on data context which we might expand later
        }
    }, [task]);

    if (!task) {
        return (
            <Layout>
                <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Loading task...</p>
                </div>
            </Layout>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title) {
            toast.error('Please enter a task title');
            return;
        }

        const assignee = formData.assigneeId
            ? members.find(m => m.id === formData.assigneeId)
            : undefined;

        const taskData = {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            status: formData.status,
            priority: formData.priority,
            assignee: assignee ? {
                id: assignee.id,
                name: assignee.name,
                avatar: assignee.avatar
            } : undefined,
            storyPoints: formData.storyPoints,
            dueDate: formData.dueDate?.toISOString(),
            tags: formData.tags
        };

        updateTask(projectId, sprintId, task.id, taskData);

        // Assign docs (simplified logic same as dialog)
        const taskKey = `${projectId}:${sprintId}:${task.id}`;
        attachedDocIds.forEach(docId => assignDocToTask(docId, taskKey));
        attachedFolderIds.forEach(folderId => assignFolderToTask(folderId, taskKey));

        toast.success('Task updated successfully');
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(projectId, sprintId, task.id);
            toast.success('Task deleted');
            router.back();
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    };

    // Helper to render priority badge
    const renderPriorityBadge = (priority: Task['priority']) => {
        const colors = {
            low: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
            medium: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
            high: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
            urgent: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
        };
        return (
            <Badge className={`rounded-xl px-2.5 py-0.5 capitalize border-0 ${colors[priority]}`}>
                {priority}
            </Badge>
        );
    };

    // Helper to render status badge
    const renderStatusBadge = (status: Task['status']) => {
        const formatStatus = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        const colors = {
            'todo': 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
            'in-progress': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
            'review': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
            'done': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
        };

        return (
            <Badge variant="outline" className={`rounded-xl px-2.5 py-0.5 border ${colors[status]}`}>
                {formatStatus(status)}
            </Badge>
        );
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto pb-6 space-y-6">
                {/* Header Navigation */}
                <div className="flex items-center justify-between gap-2">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back to Board</span>
                    </Button>
                    {!isEditing && (
                        <Button variant="outline" size="sm" className="gap-2 rounded-xl shrink-0" onClick={() => setIsEditing(true)}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Edit Task</span>
                        </Button>
                    )}
                </div>

                <div className="bg-card border rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
                    {!isEditing ? (
                        // View Mode
                        <div className="space-y-6 md:space-y-8">
                            <div className="border-b pb-4 md:pb-6">
                                <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
                                    <span className="text-muted-foreground font-medium text-xs sm:text-sm border px-2 py-0.5 rounded-md bg-muted/50">{projectKey}-{task.id}</span>
                                    {renderStatusBadge(task.status)}
                                </div>
                                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight">{task.title}</h1>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Description</Label>
                                        {task.description ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                                {task.description}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground italic text-sm">No description provided.</p>
                                        )}
                                    </div>

                                    {/* Attachments Section */}
                                    {(attachedDocIds.length > 0 || attachedFolderIds.length > 0) && (
                                        <div className="space-y-3 pt-4 border-t">
                                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Attachments</Label>
                                            <div className="flex flex-wrap gap-3">
                                                {attachedDocIds.map(docId => {
                                                    const doc = marineDox.find(d => d.id === docId);
                                                    return doc ? (
                                                        <div key={docId} onClick={() => window.open(`/marinedox`, '_blank')} className="group flex items-center gap-3 p-3 bg-muted/30 hover:bg-muted/60 cursor-pointer rounded-xl border border-border/50 transition-all">
                                                            <div className="p-2 bg-violet-100 dark:bg-violet-500/20 rounded-lg text-violet-600 dark:text-violet-400">
                                                                <FileText className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium group-hover:text-violet-600 transition-colors">{doc.title}</p>
                                                                <p className="text-xs text-muted-foreground">Document</p>
                                                            </div>
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar Meta */}
                                <div className="space-y-6">
                                    <div className="p-5 bg-muted/20 rounded-2xl border border-border/40 space-y-5">
                                        <div>
                                            <Label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider font-semibold">Details</Label>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Type</span>
                                                    <Badge variant="secondary" className="capitalize">{task.type}</Badge>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Priority</span>
                                                    {renderPriorityBadge(task.priority)}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Story Points</span>
                                                    <span className="text-sm font-medium">{task.storyPoints} pts</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-border/40 pt-4">
                                            <Label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider font-semibold">Assignee</Label>
                                            {task.assignee ? (
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={task.assignee.avatar} />
                                                        <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">{task.assignee.name}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground italic">Unassigned</span>
                                            )}
                                        </div>

                                        <div className="border-t border-border/40 pt-4">
                                            <Label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider font-semibold">Due Date</Label>
                                            <div className="flex items-center gap-2 text-sm">
                                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                <span>{task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}</span>
                                            </div>
                                        </div>

                                        {task.tags && task.tags.length > 0 && (
                                            <div className="border-t border-border/40 pt-4">
                                                <Label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider font-semibold">Tags</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {task.tags.map(tag => (
                                                        <Badge key={tag} variant="outline" className="rounded-lg text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Edit Form
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <h2 className="text-2xl font-semibold">Edit Task</h2>
                                <Button type="button" variant="destructive" size="sm" onClick={handleDelete} className="rounded-xl">
                                    Delete Task
                                </Button>
                            </div>

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="rounded-xl"
                                        placeholder="Task title"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="rounded-xl min-h-[150px]"
                                        placeholder="Add details about this task"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Select value={formData.type} onValueChange={(value: Task['type']) => setFormData({ ...formData, type: value })}>
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="task">Task</SelectItem>
                                                <SelectItem value="bug">Bug</SelectItem>
                                                <SelectItem value="story">Story</SelectItem>
                                                <SelectItem value="epic">Epic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={formData.status} onValueChange={(value: Task['status']) => setFormData({ ...formData, status: value })}>
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="todo">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-slate-400" />
                                                        <span>To Do</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="in-progress">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                        <span>In Progress</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="review">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                                                        <span>Review</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="done">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                                        <span>Done</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select value={formData.priority} onValueChange={(value: Task['priority']) => setFormData({ ...formData, priority: value })}>
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="urgent">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="storyPoints">Story Points</Label>
                                        <Input
                                            id="storyPoints"
                                            type="number"
                                            value={formData.storyPoints}
                                            onChange={(e) => setFormData({ ...formData, storyPoints: parseInt(e.target.value) || 0 })}
                                            className="rounded-xl"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="assignee">Assignee</Label>
                                    <Select value={formData.assigneeId} onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}>
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="Select assignee" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="none">Unassigned</SelectItem>
                                            {members.map((member) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={member.avatar} />
                                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span>{member.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Due Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="rounded-xl justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.dueDate ? format(formData.dueDate, 'PPP') : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={formData.dueDate}
                                                onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="tags"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                            className="rounded-xl"
                                            placeholder="Add tag and press Enter"
                                        />
                                        <Button type="button" onClick={handleAddTag} className="rounded-xl">
                                            Add
                                        </Button>
                                    </div>
                                    {formData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="rounded-full">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTag(tag)}
                                                        className="ml-1 hover:text-destructive"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t">
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl">
                                    Cancel
                                </Button>
                                <Button type="submit" className="rounded-xl">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
}
