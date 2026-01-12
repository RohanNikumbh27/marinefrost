"use client";

import { useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface SprintSelectorProps {
  projectId: string;
  currentSprintId: string;
}

export default function SprintSelector({ projectId, currentSprintId }: SprintSelectorProps) {
  const { projects } = useData();
  const router = useRouter();
  const project = projects.find(p => p.id === projectId);

  if (!project) return null;

  const handleSprintChange = (sprintId: string) => {
    router.push(`/project/${projectId}/sprint/${sprintId}`);
  };

  return (
    <Select value={currentSprintId} onValueChange={handleSprintChange}>
      <SelectTrigger className="w-[200px] rounded-xl">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
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
      </SelectContent>
    </Select>
  );
}
