"use client";

import { useState, useEffect } from 'react';
import { useData, Task, MarineDox, DocFolder } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, FileText, Link2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  projectId: string;
  sprintId: string;
  projectKey: string;
  members: Array<{ id: string; name: string; avatar: string }>;
}

export default function TaskDialog({
  open,
  onOpenChange,
  task,
  projectId,
  sprintId,
  projectKey,
  members
}: TaskDialogProps) {
  const { addTask, updateTask, deleteTask, marineDox, docFolders, assignDocToTask, assignFolderToTask } = useData();
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

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setIsEditing(false); // Default to view mode for existing tasks
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
    } else {
      setIsEditing(true); // Default to edit mode for new tasks
      setFormData({
        title: '',
        description: '',
        type: 'task',
        status: 'todo',
        priority: 'medium',
        assigneeId: '',
        storyPoints: 0,
        dueDate: undefined,
        tags: []
      });
      setAttachedDocIds([]);
      setAttachedFolderIds([]);
    }
  }, [task]);

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

    if (task) {
      updateTask(projectId, sprintId, task.id, taskData);
      // Assign docs and sets to task
      const taskKey = `${projectId}:${sprintId}:${task.id}`;
      attachedDocIds.forEach(docId => assignDocToTask(docId, taskKey));
      attachedFolderIds.forEach(folderId => assignFolderToTask(folderId, taskKey));
      toast.success('Task updated successfully');
      setIsEditing(false); // Switch back to view mode
    } else {
      addTask(projectId, sprintId, taskData);
      toast.success('Task created successfully');
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(projectId, sprintId, task.id);
      toast.success('Task deleted');
      onOpenChange(false);
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

    return (
      <Badge variant="outline" className="rounded-xl px-2.5 py-0.5 border-foreground/10 bg-muted/50">
        {formatStatus(status)}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-xl">
              {task ? (
                <span className="flex items-center gap-3">
                  <span className="text-muted-foreground font-normal text-base">{projectKey}-{task.id}</span>
                  {!isEditing && renderStatusBadge(task.status)}
                </span>
              ) : 'Create New Task'}
            </DialogTitle>
            {task && !isEditing && (
              <Button onClick={() => setIsEditing(true)} size="sm" variant="outline" className="h-8 rounded-lg gap-1.5 ml-auto">
                Edit
              </Button>
            )}
          </div>
          <DialogDescription>
            {isEditing
              ? (task ? 'Update task details' : 'Add a new task to the sprint')
              : 'View task details'
            }
          </DialogDescription>
        </DialogHeader>

        {!isEditing && task ? (
          // View Mode
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2 leading-tight">{task.title}</h2>
              <div className="flex flex-wrap gap-2 items-center">
                {renderPriorityBadge(task.priority)}
                <span className="text-sm text-muted-foreground px-1">•</span>
                <Badge variant="secondary" className="rounded-xl px-2.5 py-0.5 bg-muted/50 capitalize">
                  {task.type}
                </Badge>
                {task.storyPoints > 0 && (
                  <>
                    <span className="text-sm text-muted-foreground px-1">•</span>
                    <span className="text-sm text-muted-foreground font-medium">{task.storyPoints} pts</span>
                  </>
                )}
              </div>
            </div>

            {task.description && (
              <div className="bg-muted/30 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                {task.description}
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wider font-semibold">Assignee</Label>
                {task.assignee ? (
                  <div className="flex items-center gap-2.5 p-1.5 bg-muted/20 rounded-xl border border-border/40 w-fit pr-3">
                    <Avatar className="h-7 w-7 border-2 border-background">
                      <AvatarImage src={task.assignee.avatar} />
                      <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic pl-1">Unassigned</span>
                )}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wider font-semibold">Due Date</Label>
                {task.dueDate ? (
                  <div className="flex items-center gap-2 p-1.5 pl-0">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{format(new Date(task.dueDate), 'PPP')}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic pl-1">No due date</span>
                )}
              </div>
            </div>

            {/* Tags View */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider font-semibold">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="rounded-lg px-2.5 py-1 bg-background text-xs font-medium border-border/60">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments View - Simplified for now, reading from loaded state logic would be better but keeping simple */}
            {(attachedDocIds.length > 0 || attachedFolderIds.length > 0) && (
              <div className="border-t border-border/50 pt-5">
                <Label className="text-xs text-muted-foreground mb-3 block uppercase tracking-wider font-semibold">Attachments</Label>
                <div className="flex flex-wrap gap-2">
                  {attachedDocIds.map(docId => {
                    const doc = marineDox.find(d => d.id === docId);
                    return doc ? (
                      <div key={docId} onClick={() => window.open(`/marinedox`, '_blank')} className="flex items-center gap-2 p-2 px-3 bg-muted/40 hover:bg-muted/70 cursor-pointer rounded-xl border border-border/40 transition-colors">
                        <FileText className="h-4 w-4 text-violet-500" />
                        <span className="text-sm font-medium">{doc.title}</span>
                      </div>
                    ) : null;
                  })}
                  {attachedFolderIds.map(folderId => {
                    const folder = docFolders.find(f => f.id === folderId);
                    return folder ? (
                      <div key={folderId} className="flex items-center gap-2 p-2 px-3 bg-muted/40 hover:bg-muted/70 cursor-pointer rounded-xl border border-border/40 transition-colors">
                        <span className="text-base">{folder.icon}</span>
                        <span className="text-sm font-medium">{folder.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Footer Actions for View Mode */}
            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">
                Close
              </Button>
            </div>
          </div>
        ) : (
          // Edit Mode Form
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
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
                  className="rounded-xl"
                  rows={3}
                  placeholder="Add details about this task"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Attached Documents */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Attached Documents
                </Label>
                <Select
                  value=""
                  onValueChange={(docId) => {
                    if (docId && !attachedDocIds.includes(docId)) {
                      setAttachedDocIds([...attachedDocIds, docId]);
                    }
                  }}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Link a document..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {marineDox.filter(doc => !attachedDocIds.includes(doc.id)).length === 0 ? (
                      <div className="p-2 flex flex-col items-center justify-center gap-2">
                        <p className="text-xs text-muted-foreground text-center">No available documents</p>
                        <Button
                          size="sm"
                          className="w-full text-xs h-8 rounded-lg text-white hover:bg-violet-700"
                          style={{ backgroundColor: 'var(--marinedox-primary)' }}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open('/marinedox', '_blank');
                          }}
                        >
                          <FileText className="h-3 w-3 mr-2" />
                          Create New
                        </Button>
                      </div>
                    ) : (
                      marineDox
                        .filter(doc => !attachedDocIds.includes(doc.id))
                        .map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              {doc.title}
                            </div>
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                {attachedDocIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {attachedDocIds.map((docId) => {
                      const doc = marineDox.find(d => d.id === docId);
                      return doc ? (
                        <Badge key={docId} variant="secondary" className="rounded-full">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc.title}
                          <button
                            type="button"
                            onClick={() => setAttachedDocIds(attachedDocIds.filter(id => id !== docId))}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Attached Folders */}
              {docFolders.length > 0 && (
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Attached Folders
                  </Label>
                  <Select
                    value=""
                    onValueChange={(folderId) => {
                      if (folderId && !attachedFolderIds.includes(folderId)) {
                        setAttachedFolderIds([...attachedFolderIds, folderId]);
                      }
                    }}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Link a folder..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {docFolders
                        .filter(folder => !attachedFolderIds.includes(folder.id))
                        .map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            <div className="flex items-center gap-2">
                              <span>{folder.icon}</span>
                              {folder.name}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {attachedFolderIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {attachedFolderIds.map((folderId) => {
                        const folder = docFolders.find(f => f.id === folderId);
                        return folder ? (
                          <Badge
                            key={folderId}
                            className="rounded-full"
                            style={{ backgroundColor: `${folder.color}20`, color: folder.color }}
                          >
                            <span className="mr-1">{folder.icon}</span>
                            {folder.name}
                            <button
                              type="button"
                              onClick={() => setAttachedFolderIds(attachedFolderIds.filter(id => id !== folderId))}
                              className="ml-1 hover:opacity-70"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between">
              {task && (
                <Button type="button" variant="destructive" onClick={handleDelete} className="rounded-xl">
                  Delete
                </Button>
              )}
              <div className="flex space-x-2 ml-auto">
                <Button type="button" variant="outline" onClick={() => task ? setIsEditing(false) : onOpenChange(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl">
                  {task ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
