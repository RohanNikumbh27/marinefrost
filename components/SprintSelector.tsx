"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import CreateSprintDialog from '@/components/CreateSprintDialog';

interface SprintSelectorProps {
  projectId: string;
  currentSprintId: string;
}

export default function SprintSelector({ projectId, currentSprintId }: SprintSelectorProps) {
  const { projects } = useData();
  const router = useRouter();
  const project = projects.find(p => p.id === projectId);

  if (!project) return null;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleSprintChange = (value: string) => {
    if (value === 'create_new') {
      setIsCreateDialogOpen(true);
      return;
    }
    router.push(`/project/${projectId}/sprint/${value}`);
  };

  return (
    <>
      <Select value={currentSprintId} onValueChange={handleSprintChange}>
        <SelectTrigger className="w-[200px] rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-xl gap-10">
          {project.sprints.map((sprint) => (
            <SelectItem key={sprint.id} value={sprint.id}>
              <div className="flex items-center justify-between w-full">
                <span>{sprint.name}</span>
                <Badge
                  variant={sprint.status === 'active' ? 'default' : sprint.status === 'completed' ? 'secondary' : 'outline'}
                  className="ml-2 rounded-full text-xs"
                >
                  {sprint.status}
                </Badge>
              </div>
            </SelectItem>
          ))}
          <div className="pt-1.5 border-t mt-1">
            <SelectItem value="create_new" className="text-blue-600 focus:text-blue-700 font-medium cursor-pointer">
              <span className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create New Sprint
              </span>
            </SelectItem>
          </div>
        </SelectContent>
      </Select>

      <CreateSprintDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        projectId={projectId}
      />
    </>
  );
}
