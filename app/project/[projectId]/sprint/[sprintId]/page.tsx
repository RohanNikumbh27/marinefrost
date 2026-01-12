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
import { Plus, Calendar, Clock, Filter, Users2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SprintView() {
  const { projectId, sprintId } = useParams() as { projectId: string; sprintId?: string };
  const { projects, updateTask } = useData();
  const router = useRouter();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: project.color }}
              >
                <span className="font-bold text-sm">{project.key}</span>
              </div>
              <div>
                <h1 className="text-2xl">{project.name}</h1>
                <p className="text-sm text-muted-foreground">{sprint.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <SprintSelector projectId={projectId!} currentSprintId={sprintId!} />
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => router.push(`/project/${projectId}/timeline`)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Timeline
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => router.push(`/project/${projectId}/calendar`)}
            >
              <Clock className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>

        {/* Sprint Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <Button onClick={handleCreateTask} className="rounded-xl">
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
                        <td className="p-4">
                          <Badge className="rounded-full capitalize">
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
      </div>
    </Layout>
  );
}
