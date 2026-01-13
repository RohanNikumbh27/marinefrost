"use client";

import { useState, useEffect } from 'react';
import { useData, Task } from '@/contexts/DataContext';
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
import { CalendarIcon, X } from 'lucide-react';
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
  const { addTask, updateTask, deleteTask } = useData();
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
    } else {
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
      toast.success('Task updated successfully');
    } else {
      addTask(projectId, sprintId, taskData);
      toast.success('Task created successfully');
    }

    onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? `${projectKey}-${task.id}` : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update task details' : 'Add a new task to the sprint'}
          </DialogDescription>
        </DialogHeader>
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
          </div>

          <DialogFooter className="flex justify-between">
            {task && (
              <Button type="button" variant="destructive" onClick={handleDelete} className="rounded-xl">
                Delete
              </Button>
            )}
            <div className="flex space-x-2 ml-auto">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl">
                {task ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
