"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from '@/components/Layout';
import { useData, Task } from '@/contexts/DataContext';
import TaskBoard from '@/components/TaskBoard';
import TaskDialog from '@/components/TaskDialog';
import SprintSelector from '@/components/SprintSelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, Filter, Users2, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import SprintActions from '@/components/SprintActions';
import ProjectSettingsDialog from '@/components/ProjectSettingsDialog';

export default function SprintView() {
  const { projectId, sprintId } = useParams() as { projectId: string; sprintId?: string };
  const { projects, updateTask } = useData();
  const router = useRouter();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const project = projects.find(p => p.id === projectId);
  const sprint = project?.sprints.find(s => s.id === sprintId);

  if (!project || !sprint) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16">
          <h2>Sprint not found</h2>
          <Button onClick={() => router.push('/dashboard')} className="mt-4 rounded-xl">
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    if (projectId && sprintId) {
      updateTask(projectId, sprintId, taskId, { status: newStatus });
      toast.success('Task updated');
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsTaskDialogOpen(true);
  };

  const stats = {
    todo: sprint.tasks.filter(t => t.status === 'todo').length,
    inProgress: sprint.tasks.filter(t => t.status === 'in-progress').length,
    review: sprint.tasks.filter(t => t.status === 'review').length,
    done: sprint.tasks.filter(t => t.status === 'done').length,
    total: sprint.tasks.length
  };

  const progress = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: project.color }}
              >
                <span className="font-bold text-sm">{project.key}</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-semibold truncate">{project.name}</h1>
                <p className="text-sm text-muted-foreground truncate">{sprint.name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full">
            <SprintSelector projectId={projectId!} currentSprintId={sprintId!} />
            <div className="ml-auto">
              <SprintActions projectId={projectId!} sprint={sprint} />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              size="sm"
              onClick={() => router.push(`/project/${projectId}/timeline`)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span>Timeline</span>
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              size="sm"
              onClick={() => router.push(`/project/${projectId}/calendar`)}
            >
              <Clock className="h-4 w-4 mr-2" />
              <span>Calendar</span>
            </Button>
            <Button
              onClick={handleCreateTask}
              className="col-span-2 rounded-xl md:hidden"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>
        {/* Sprint Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-card rounded-2xl p-4 border">
            <div className="text-sm text-muted-foreground mb-1">Progress</div>
            <div className="text-2xl font-semibold">{Math.round(progress)}%</div>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 border">
            <div className="text-sm text-muted-foreground mb-1">Total Tasks</div>
            <div className="text-2xl font-semibold">{stats.total}</div>
            <div className="text-xs text-muted-foreground mt-2">{stats.done} completed</div>
          </div>
          <div className="bg-card rounded-2xl p-4 border">
            <div className="text-sm text-muted-foreground mb-1">In Progress</div>
            <div className="text-2xl font-semibold text-blue-600">{stats.inProgress}</div>
            <div className="text-xs text-muted-foreground mt-2">Active tasks</div>
          </div>
          <div className="bg-card rounded-2xl p-4 border">
            <div className="text-sm text-muted-foreground mb-1">Team</div>
            <div className="flex -space-x-2 mt-2">
              {project.members.slice(0, 4).map(member => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  className="h-8 w-8 rounded-full border-2 border-background"
                  title={member.name}
                />
              ))}
              {project.members.length > 4 && (
                <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs">
                  +{project.members.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="board" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="rounded-xl">
              <TabsTrigger value="board" className="rounded-lg">Board</TabsTrigger>
              <TabsTrigger value="list" className="rounded-lg">List</TabsTrigger>
            </TabsList>
            <Button onClick={handleCreateTask} className="rounded-xl hidden md:flex">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>

          <TabsContent value="board" className="space-y-4">
            <DndProvider backend={HTML5Backend}>
              <TaskBoard
                tasks={sprint.tasks}
                onTaskMove={handleTaskMove}
                onTaskClick={handleTaskClick}
              />
            </DndProvider>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="bg-card rounded-2xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium">Task</th>
                      <th className="text-left p-4 text-sm font-medium">Type</th>
                      <th className="text-left p-4 text-sm font-medium">Status</th>
                      <th className="text-left p-4 text-sm font-medium">Priority</th>
                      <th className="text-left p-4 text-sm font-medium">Assignee</th>
                      <th className="text-left p-4 text-sm font-medium">Points</th>
                      <th className="text-left p-4 text-sm font-medium">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sprint.tasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-t hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleTaskClick(task)}
                      >
                        <td className="p-4">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">{project.key}-{task.id}</div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="rounded-full capitalize">
                            {task.type}
                          </Badge>
                        </td>
                        <td className="p-4">                          <Badge
                          variant="outline"
                          className={`rounded-full capitalize border ${task.status === 'todo' ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                              task.status === 'review' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                                'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
                            }`}
                        >
                          {task.status.replace('-', ' ')}
                        </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={task.priority === 'urgent' || task.priority === 'high' ? 'destructive' : 'secondary'}
                            className="rounded-full capitalize"
                          >
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {task.assignee ? (
                            <div className="flex items-center space-x-2">
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="h-6 w-6 rounded-full"
                              />
                              <span className="text-sm">{task.assignee.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Unassigned</span>
                          )}
                        </td>
                        <td className="p-4 text-sm">{task.storyPoints}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <TaskDialog
          open={isTaskDialogOpen}
          onOpenChange={setIsTaskDialogOpen}
          task={selectedTask}
          projectId={projectId!}
          sprintId={sprintId!}
          projectKey={project.key}
          members={project.members}
        />

        <ProjectSettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          project={project}
        />
      </div>
    </Layout >
  );
}
