"use client";

import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { format, parseISO, differenceInDays, startOfWeek, addDays } from 'date-fns';

export default function TimelineView() {
  const { projectId } = useParams() as { projectId: string; sprintId?: string };
  const { projects } = useData();
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16">
          <h2>Project not found</h2>
          <Button onClick={() => router.push('/dashboard')} className="mt-4 rounded-xl">
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const allTasks = project.sprints.flatMap(sprint =>
    sprint.tasks.map(task => ({ ...task, sprintName: sprint.name, sprintId: sprint.id }))
  );

  const filteredTasks = allTasks
    .filter(task => filterStatus === 'all' || task.status === filterStatus)
    .filter(task => filterPriority === 'all' || task.priority === filterPriority)
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl">Project Timeline</h1>
              <p className="text-muted-foreground">{project.name}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px] rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
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
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[150px] rounded-xl">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="rounded-2xl">
              <CardContent className="flex items-center justify-center py-16">
                <p className="text-muted-foreground">No tasks found with the selected filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => {
              const daysUntilDue = task.dueDate ? differenceInDays(parseISO(task.dueDate), new Date()) : null;
              const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
              const isDueSoon = daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 3;

              return (
                <Card
                  key={task.id}
                  className="rounded-2xl cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => router.push(`/project/${projectId}/sprint/${task.sprintId}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="rounded-full">
                            {project.key}-{task.id}
                          </Badge>
                          <Badge
                            variant={task.priority === 'urgent' || task.priority === 'high' ? 'destructive' : 'secondary'}
                            className="rounded-full capitalize"
                          >
                            {task.priority}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`rounded-full capitalize border ${task.status === 'todo' ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20' :
                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                                  task.status === 'review' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                                    'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
                              }`}
                          >
                            {task.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <CardTitle>{task.title}</CardTitle>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Sprint: {task.sprintName}</p>
                      </div>
                      {task.assignee && (
                        <div className="flex items-center space-x-2 ml-4">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="text-sm">{task.assignee.name}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Story Points: {task.storyPoints}</span>
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex space-x-1">
                            {task.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs rounded-full">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {task.dueDate && (
                        <div className={`text-sm font-medium ${isOverdue ? 'text-destructive' : isDueSoon ? 'text-orange-500' : 'text-muted-foreground'}`}>
                          Due: {format(parseISO(task.dueDate), 'MMM dd, yyyy')}
                          {daysUntilDue !== null && (
                            <span className="ml-2">
                              ({daysUntilDue === 0 ? 'Today' : isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
