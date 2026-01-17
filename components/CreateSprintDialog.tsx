"use client";

import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SprintDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    sprint?: {
        id: string;
        name: string;
        goal?: string;
        startDate: string;
        endDate: string;
        status: 'planned' | 'active' | 'completed';
    };
}

export default function CreateSprintDialog({ open, onOpenChange, projectId, sprint }: SprintDialogProps) {
    const { addSprint, updateSprint } = useData();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(sprint?.name || '');
    const [goal, setGoal] = useState(sprint?.goal || '');
    const [startDate, setStartDate] = useState<Date | undefined>(sprint ? new Date(sprint.startDate) : new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(sprint ? new Date(sprint.endDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));

    // Update state when sprint prop changes (for editing)
    useEffect(() => {
        if (open) {
            if (sprint) {
                setName(sprint.name);
                setGoal(sprint.goal || '');
                setStartDate(new Date(sprint.startDate));
                setEndDate(new Date(sprint.endDate));
            } else {
                // Reset for create mode
                setName('');
                setGoal('');
                setStartDate(new Date());
                setEndDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));
            }
        }
    }, [open, sprint]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        if (!startDate || !endDate) {
            toast.error('Please select both start and end dates');
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (sprint) {
            updateSprint(projectId, sprint.id, {
                name,
                goal,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            });
            toast.success('Sprint updated successfully');
        } else {
            addSprint(projectId, {
                name,
                goal,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                status: 'planned'
            });
            toast.success('Sprint created successfully');
        }

        setLoading(false);
        onOpenChange(false);
        if (!sprint) resetForm();
    };

    const resetForm = () => {
        setName('');
        setGoal('');
        setStartDate(new Date());
        setEndDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle>{sprint ? 'Edit Sprint' : 'Create New Sprint'}</DialogTitle>
                    <DialogDescription>
                        Plan your next iteration. Define the goal and timeline for this sprint.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Sprint Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sprint 2 - Feature Development"
                            className="rounded-xl"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="goal">Sprint Goal (Optional)</Label>
                        <Textarea
                            id="goal"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="What do you want to achieve in this sprint?"
                            className="resize-none rounded-xl"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal rounded-xl",
                                            !startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal rounded-xl",
                                            !endDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="rounded-xl">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Sprint
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
