"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Filter } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

export default function GlobalCalendarPage() {
    const { projects } = useData();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [filterProject, setFilterProject] = useState<string>('all');

    // Get all tasks from all projects
    const allTasks = projects.flatMap(project =>
        project.sprints.flatMap(sprint =>
            sprint.tasks
                .filter(task => task.dueDate)
                .map(task => ({
                    ...task,
                    projectId: project.id,
                    projectName: project.name,
                    projectKey: project.key,
                    sprintName: sprint.name,
                    sprintId: sprint.id
                }))
        )
    ).filter(task => filterProject === 'all' || task.projectId === filterProject);

    const tasksForSelectedDate = selectedDate
        ? allTasks.filter(task => task.dueDate && isSameDay(parseISO(task.dueDate), selectedDate))
        : [];

    const taskDates = allTasks
        .filter(task => task.dueDate)
        .map(task => parseISO(task.dueDate!));

    const upcomingTasks = allTasks
        .filter(task => task.dueDate && parseISO(task.dueDate) >= new Date())
        .sort((a, b) => parseISO(a.dueDate!).getTime() - parseISO(b.dueDate!).getTime())
        .slice(0, 8);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold flex items-center gap-2">
                            <CalendarDays className="h-8 w-8 text-orange-500" />
                            Calendar
                        </h1>
                        <p className="text-muted-foreground">View and manage tasks across all projects</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={filterProject} onValueChange={setFilterProject}>
                            <SelectTrigger className="w-[200px] rounded-xl">
                                <SelectValue placeholder="All Projects" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Projects</SelectItem>
                                {projects.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <Card className="lg:col-span-2 p-6 lg:p-8 rounded-2xl">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-xl w-full"
                            modifiers={{
                                hasTask: taskDates
                            }}
                            modifiersStyles={{
                                hasTask: {
                                    backgroundColor: 'rgba(249, 115, 22, 0.15)',
                                    fontWeight: 'bold',
                                    borderRadius: '10px'
                                }
                            }}
                        />
                    </Card>

                    {/* Tasks for Selected Date */}
                    <div className="space-y-4">
                        <Card className="p-4 rounded-2xl">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-orange-500" />
                                {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select a date'}
                            </h3>
                            {tasksForSelectedDate.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No tasks due on this date
                                </p>
                            ) : (
                                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                    {tasksForSelectedDate.map((task) => (
                                        <div
                                            key={`${task.projectId}-${task.id}`}
                                            className="p-3 bg-accent rounded-xl cursor-pointer hover:bg-accent/80 transition-colors"
                                            onClick={() => router.push(`/project/${task.projectId}/sprint/${task.sprintId}`)}
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
                                                {task.projectKey}-{task.id} • {task.projectName}
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

                        {/* Upcoming Tasks */}
                        <Card className="p-4 rounded-2xl">
                            <h3 className="font-semibold mb-4">Upcoming Tasks</h3>
                            {upcomingTasks.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No upcoming tasks
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                                    {upcomingTasks.map((task) => (
                                        <div
                                            key={`${task.projectId}-${task.id}`}
                                            className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors text-sm"
                                            onClick={() => router.push(`/project/${task.projectId}/sprint/${task.sprintId}`)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <span className="truncate block">{task.title}</span>
                                                <span className="text-xs text-muted-foreground">{task.projectName}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground ml-2 shrink-0">
                                                {format(parseISO(task.dueDate!), 'MMM dd')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
