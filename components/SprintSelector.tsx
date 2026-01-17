"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  const [open, setOpen] = useState(false);

  const currentSprint = project.sprints.find((s) => s.id === currentSprintId);

  const handleSprintChange = (value: string) => {
    if (value === 'create_new') {
      setIsCreateDialogOpen(true);
      return;
    }
    router.push(`/project/${projectId}/sprint/${value}`);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between rounded-xl font-normal px-3"
          >
            {currentSprint ? (
              <span className="truncate">{currentSprint.name}</span>
            ) : "Select sprint..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0 rounded-xl" align="start">
          <Command>
            {project.sprints.length > 5 && (
              <CommandInput placeholder="Search sprint..." />
            )}
            <CommandList className={project.sprints.length > 5 ? "max-h-[200px] overflow-y-auto" : ""}>
              <CommandEmpty>No sprint found.</CommandEmpty>
              <CommandGroup>
                {project.sprints.map((sprint) => (
                  <CommandItem
                    key={sprint.id}
                    value={sprint.name} // Command uses value for search filtering by default
                    onSelect={() => {
                      handleSprintChange(sprint.id);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate mr-2">{sprint.name}</span>
                    <div className="flex items-center shrink-0">
                      <Badge
                        variant={sprint.status === 'active' ? 'default' : sprint.status === 'completed' ? 'secondary' : 'outline'}
                        className="mr-2 rounded-full text-[10px] px-1.5 h-5 min-w-[50px] justify-center"
                      >
                        {sprint.status}
                      </Badge>
                      <Check
                        className={`h-4 w-4 ${currentSprintId === sprint.id ? "opacity-100" : "opacity-0"
                          }`}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="p-1 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  handleSprintChange('create_new');
                  setOpen(false);
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-2" />
                <span className="text-sm font-medium">Create New Sprint</span>
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateSprintDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        projectId={projectId}
      />
    </>
  );
}
