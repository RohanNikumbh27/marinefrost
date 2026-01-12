"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

export default function CalendarView() {
  const { projectId } = useParams() as { projectId: string; sprintId?: string };
  const { projects } = useData();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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
    sprint.tasks
      .filter(task => task.dueDate)
      .map(task => ({ ...task, sprintName: sprint.name, sprintId: sprint.id }))
  );

  const tasksForSelectedDate = selectedDate
    ? allTasks.filter(task => task.dueDate && isSameDay(parseISO(task.dueDate), selectedDate))
    : [];

  const taskDates = allTasks
    .filter(task => task.dueDate)
    .map(task => parseISO(task.dueDate!));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
            className="rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl">Calendar View</h1>
            <p className="text-muted-foreground">{project.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 rounded-2xl">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-xl"
              modifiers={{
                hasTask: taskDates
              }}
              modifiersStyles={{
                hasTask: {
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fontWeight: 'bold'
                }
              }}
            />
          </Card>

          <div className="space-y-4">
            <Card className="p-4 rounded-2xl">
              <h3 className="font-semibold mb-4">
                {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select a date'}
              </h3>
              {tasksForSelectedDate.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No tasks due on this date
                </p>
              ) : (
                <div className="space-y-3">
                  {tasksForSelectedDate.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-accent rounded-xl cursor-pointer hover:bg-accent/80 transition-colors"
                      onClick={() => router.push(`/project/${projectId}/sprint/${task.sprintId}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge
                          variant={task.priority === 'urgent' || task.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs rounded-full capitalize"
                        >
                          {task.priority}
                        </Badge>
                        <Badge className="text-xs rounded-full capitalize">
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {project.key}-{task.id} • {task.sprintName}
                      </p>
                      {task.assignee && (
                        <div className="flex items-center space-x-2 mt-2">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="h-5 w-5 rounded-full"
                          />
                          <span className="text-xs">{task.assignee.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-4 rounded-2xl">
              <h3 className="font-semibold mb-4">Upcoming Tasks</h3>
              <div className="space-y-2">
                {allTasks
                  .filter(task => task.dueDate && parseISO(task.dueDate) >= new Date())
                  .sort((a, b) => parseISO(a.dueDate!).getTime() - parseISO(b.dueDate!).getTime())
                  .slice(0, 5)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors text-sm"
                      onClick={() => router.push(`/project/${projectId}/sprint/${task.sprintId}`)}
                    >
                      <span className="truncate flex-1">{task.title}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {format(parseISO(task.dueDate!), 'MMM dd')}
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
