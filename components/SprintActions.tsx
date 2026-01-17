"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Play, CheckCircle2, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CreateSprintDialog from './CreateSprintDialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SprintActionsProps {
    projectId: string;
    sprint: {
        id: string;
        name: string;
        goal?: string;
        startDate: string;
        endDate: string;
        status: 'planned' | 'active' | 'completed';
    };
}

export default function SprintActions({ projectId, sprint }: SprintActionsProps) {
    const { updateSprint, deleteSprint } = useData();
    const router = useRouter();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleStartSprint = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        updateSprint(projectId, sprint.id, { status: 'active' });
        toast.success(`${sprint.name} started successfully!`);
        setLoading(false);
    };

    const handleCompleteSprint = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        updateSprint(projectId, sprint.id, { status: 'completed' });
        toast.success(`${sprint.name} completed!`);
        setLoading(false);
    };

    const handleDeleteSprint = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        deleteSprint(projectId, sprint.id);
        toast.success('Sprint deleted');
        setLoading(false);
        // Redirect to project dashboard or first sprint
        router.push(`/project/${projectId}/dashboard`);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <DropdownMenuLabel>Sprint Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {sprint.status === 'planned' && (
                        <DropdownMenuItem onClick={handleStartSprint} disabled={loading} className="cursor-pointer">
                            <Play className="h-4 w-4 mr-2 text-blue-500" />
                            Start Sprint
                        </DropdownMenuItem>
                    )}

                    {sprint.status === 'active' && (
                        <DropdownMenuItem onClick={handleCompleteSprint} disabled={loading} className="cursor-pointer">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            Complete Sprint
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="cursor-pointer">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Sprint
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Sprint
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CreateSprintDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                projectId={projectId}
                sprint={sprint}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete
                            <span className="font-semibold text-foreground"> {sprint.name} </span>
                            and all its data. Tasks inside will be deleted or need reassignment.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteSprint}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Sprint'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
