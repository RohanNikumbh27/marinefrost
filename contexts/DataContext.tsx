"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignee?: {
        id: string;
        name: string;
        avatar: string;
    };
    reporter?: {
        id: string;
        name: string;
        avatar: string;
    };
    storyPoints: number;
    dueDate?: string;
    createdAt: string;
    tags?: string[];
    type: 'task' | 'bug' | 'story' | 'epic';
    attachedDocs?: string[]; // MarineDox document IDs
}

export interface Sprint {
    id: string;
    name: string;
    goal?: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'planned' | 'completed';
    tasks: Task[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    key: string;
    color: string;
    sprints: Sprint[];
    members: Array<{
        id: string;
        name: string;
        email: string;
        avatar: string;
        role: string;
    }>;
    createdAt: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'task' | 'sprint' | 'calendar' | 'team';
    read: boolean;
    createdAt: string;
    link?: string;
    category?: string;
}

export interface MarineDox {
    id: string;
    title: string;
    content: string; // HTML content from rich text editor
    projectId?: string; // Optional association with a project
    author: {
        id: string;
        name: string;
        avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface DataContextType {
    projects: Project[];
    notifications: Notification[];
    marineDox: MarineDox[];
    tasks: any[];
    addProject: (project: Omit<Project, 'id' | 'createdAt' | 'sprints'>) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    addSprint: (projectId: string, sprint: Omit<Sprint, 'id' | 'tasks'>) => void;
    updateSprint: (projectId: string, sprintId: string, updates: Partial<Sprint>) => void;
    deleteSprint: (projectId: string, sprintId: string) => void;
    addTask: (projectId: string, sprintId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
    updateTask: (projectId: string, sprintId: string, taskId: string, updates: Partial<Task>) => void;
    deleteTask: (projectId: string, sprintId: string, taskId: string) => void;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    deleteNotification: (id: string) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
    // MarineDox methods
    addMarineDox: (doc: Omit<MarineDox, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateMarineDox: (id: string, updates: Partial<MarineDox>) => void;
    deleteMarineDox: (id: string) => void;
    getMarineDoxByProject: (projectId: string) => MarineDox[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialProjects: Project[] = [
    {
        id: '1',
        name: 'MarineFrost Development',
        description: 'Building the next generation project management tool',
        key: 'MF',
        color: '#0052CC',
        createdAt: new Date(2024, 11, 1).toISOString(),
        members: [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@marinefrost.com',
                avatar: 'https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzcxNjQ1NHww&ixlib=rb-4.1.0&q=80&w=400',
                role: 'Product Manager'
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@marinefrost.com',
                avatar: 'https://images.unsplash.com/photo-1754298949882-216a1c92dbb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NzgzODkyfDA&ixlib=rb-4.1.0&q=80&w=400',
                role: 'Developer'
            },
            {
                id: '3',
                name: 'Bob Wilson',
                email: 'bob@marinefrost.com',
                avatar: 'https://images.unsplash.com/photo-1638338276001-cfc1f7fb21cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzcyNTc5OXww&ixlib=rb-4.1.0&q=80&w=400',
                role: 'Designer'
            }
        ],
        sprints: [
            {
                id: 's1',
                name: 'Sprint 1 - Foundation',
                goal: 'Set up core architecture and authentication',
                startDate: new Date(2024, 11, 1).toISOString(),
                endDate: new Date(2024, 11, 15).toISOString(),
                status: 'active',
                tasks: [
                    {
                        id: 't1',
                        title: 'Setup project structure',
                        description: 'Initialize project with React and TypeScript',
                        status: 'done',
                        priority: 'high',
                        assignee: {
                            id: '2',
                            name: 'Jane Smith',
                            avatar: 'https://images.unsplash.com/photo-1754298949882-216a1c92dbb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NzgzODkyfDA&ixlib=rb-4.1.0&q=80&w=400'
                        },
                        reporter: {
                            id: '1',
                            name: 'John Doe',
                            avatar: 'https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzcxNjQ1NHww&ixlib=rb-4.1.0&q=80&w=400'
                        },
                        storyPoints: 5,
                        dueDate: new Date(2024, 11, 5).toISOString(),
                        createdAt: new Date(2024, 11, 1).toISOString(),
                        tags: ['setup', 'infrastructure'],
                        type: 'task'
                    },
                    {
                        id: 't2',
                        title: 'Implement authentication',
                        description: 'Add login and registration functionality',
                        status: 'in-progress',
                        priority: 'high',
                        assignee: {
                            id: '2',
                            name: 'Jane Smith',
                            avatar: 'https://images.unsplash.com/photo-1754298949882-216a1c92dbb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NzgzODkyfDA&ixlib=rb-4.1.0&q=80&w=400'
                        },
                        storyPoints: 8,
                        dueDate: new Date(2024, 11, 10).toISOString(),
                        createdAt: new Date(2024, 11, 2).toISOString(),
                        tags: ['auth', 'security'],
                        type: 'story'
                    },
                    {
                        id: 't3',
                        title: 'Design dashboard UI',
                        description: 'Create mockups for main dashboard',
                        status: 'review',
                        priority: 'medium',
                        assignee: {
                            id: '3',
                            name: 'Bob Wilson',
                            avatar: 'https://images.unsplash.com/photo-1638338276001-cfc1f7fb21cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzcyNTc5OXww&ixlib=rb-4.1.0&q=80&w=400'
                        },
                        storyPoints: 5,
                        dueDate: new Date(2024, 11, 8).toISOString(),
                        createdAt: new Date(2024, 11, 1).toISOString(),
                        tags: ['design', 'ui'],
                        type: 'task'
                    },
                    {
                        id: 't4',
                        title: 'Create task management system',
                        description: 'Build CRUD operations for tasks',
                        status: 'todo',
                        priority: 'high',
                        storyPoints: 13,
                        dueDate: new Date(2024, 11, 14).toISOString(),
                        createdAt: new Date(2024, 11, 3).toISOString(),
                        tags: ['backend', 'core'],
                        type: 'epic'
                    },
                    {
                        id: 't5',
                        title: 'Fix responsive layout issues',
                        description: 'Mobile view not displaying correctly',
                        status: 'todo',
                        priority: 'medium',
                        assignee: {
                            id: '3',
                            name: 'Bob Wilson',
                            avatar: 'https://images.unsplash.com/photo-1638338276001-cfc1f7fb21cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzcyNTc5OXww&ixlib=rb-4.1.0&q=80&w=400'
                        },
                        storyPoints: 3,
                        createdAt: new Date(2024, 11, 4).toISOString(),
                        tags: ['bug', 'ui'],
                        type: 'bug'
                    }
                ]
            }
        ]
    }
];

const initialNotifications: Notification[] = [
    {
        id: '1',
        title: 'New task assigned',
        message: 'You have been assigned to \"Implement authentication\"',
        type: 'task',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        link: '/project/1/sprint/s1',
        category: 'Assignment'
    },
    {
        id: '2',
        title: 'Sprint deadline approaching',
        message: 'Sprint 1 - Foundation ends in 3 days. Make sure all tasks are updated!',
        type: 'sprint',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        category: 'Deadline'
    },
    {
        id: '3',
        title: 'Comment on your task',
        message: 'John Doe commented on \"Design dashboard UI\": Great progress so far!',
        type: 'info',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        category: 'Comment'
    },
    {
        id: '4',
        title: 'Task completed',
        message: 'Jane Smith marked \"Setup project structure\" as complete',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        category: 'Progress'
    },
    {
        id: '5',
        title: 'New team member added',
        message: 'Welcome Bob Wilson to the MarineFrost Development project!',
        type: 'team',
        read: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        category: 'Team'
    },
    {
        id: '6',
        title: 'Upcoming meeting',
        message: 'Sprint planning meeting scheduled for tomorrow at 10:00 AM',
        type: 'calendar',
        read: false,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        category: 'Meeting'
    },
    {
        id: '7',
        title: 'Task priority changed',
        message: 'Priority of \"Fix responsive layout issues\" changed to High',
        type: 'warning',
        read: true,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        category: 'Update'
    },
    {
        id: '8',
        title: 'Sprint started',
        message: 'Sprint 1 - Foundation is now active. Good luck team!',
        type: 'sprint',
        read: true,
        createdAt: new Date(Date.now() - 518400000).toISOString(),
        category: 'Sprint'
    }
];

export function DataProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [marineDox, setMarineDox] = useState<MarineDox[]>([]);

    useEffect(() => {
        const savedProjects = localStorage.getItem('marinefrost_projects');
        const savedNotifications = localStorage.getItem('marinefrost_notifications');
        const savedMarineDox = localStorage.getItem('marinefrost_marinedox');

        if (savedProjects) {
            setProjects(JSON.parse(savedProjects));
        } else {
            setProjects(initialProjects);
        }

        if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
        } else {
            setNotifications(initialNotifications);
        }

        if (savedMarineDox) {
            setMarineDox(JSON.parse(savedMarineDox));
        }
    }, []);

    useEffect(() => {
        if (projects.length > 0) {
            localStorage.setItem('marinefrost_projects', JSON.stringify(projects));
        }
    }, [projects]);

    useEffect(() => {
        if (notifications.length > 0) {
            localStorage.setItem('marinefrost_notifications', JSON.stringify(notifications));
        }
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem('marinefrost_marinedox', JSON.stringify(marineDox));
    }, [marineDox]);

    const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'sprints'>) => {
        const newProject: Project = {
            ...project,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            sprints: [{
                id: 's1',
                name: 'Example Sprint',
                goal: 'Edit this sprint or create a new one',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'planned',
                tasks: []
            }]
        };
        setProjects([...projects, newProject]);
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProject = (id: string) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    const addSprint = (projectId: string, sprint: Omit<Sprint, 'id' | 'tasks'>) => {
        setProjects(projects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    sprints: [...p.sprints, { ...sprint, id: `s${Date.now()}`, tasks: [] }]
                };
            }
            return p;
        }));
    };

    const updateSprint = (projectId: string, sprintId: string, updates: Partial<Sprint>) => {
        setProjects(projects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    sprints: p.sprints.map(s => s.id === sprintId ? { ...s, ...updates } : s)
                };
            }
            return p;
        }));
    };

    const deleteSprint = (projectId: string, sprintId: string) => {
        setProjects(projects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    sprints: p.sprints.filter(s => s.id !== sprintId)
                };
            }
            return p;
        }));
    };

    const addTask = (projectId: string, sprintId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
        setProjects(projects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    sprints: p.sprints.map(s => {
                        if (s.id === sprintId) {
                            return {
                                ...s,
                                tasks: [...s.tasks, { ...task, id: `t${Date.now()}`, createdAt: new Date().toISOString() }]
                            };
                        }
                        return s;
                    })
                };
            }
            return p;
        }));
    };

    const updateTask = (projectId: string, sprintId: string, taskId: string, updates: Partial<Task>) => {
        setProjects(projects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    sprints: p.sprints.map(s => {
                        if (s.id === sprintId) {
                            return {
                                ...s,
                                tasks: s.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
                            };
                        }
                        return s;
                    })
                };
            }
            return p;
        }));
    };

    const deleteTask = (projectId: string, sprintId: string, taskId: string) => {
        setProjects(projects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    sprints: p.sprints.map(s => {
                        if (s.id === sprintId) {
                            return {
                                ...s,
                                tasks: s.tasks.filter(t => t.id !== taskId)
                            };
                        }
                        return s;
                    })
                };
            }
            return p;
        }));
    };

    const markNotificationAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllNotificationsAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            read: false,
            createdAt: new Date().toISOString()
        };
        setNotifications([newNotification, ...notifications]);
    };

    // MarineDox CRUD operations
    const addMarineDox = (doc: Omit<MarineDox, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newDoc: MarineDox = {
            ...doc,
            id: `doc_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setMarineDox([newDoc, ...marineDox]);
    };

    const updateMarineDox = (id: string, updates: Partial<MarineDox>) => {
        setMarineDox(marineDox.map(doc =>
            doc.id === id
                ? { ...doc, ...updates, updatedAt: new Date().toISOString() }
                : doc
        ));
    };

    const deleteMarineDox = (id: string) => {
        setMarineDox(marineDox.filter(doc => doc.id !== id));
    };

    const getMarineDoxByProject = (projectId: string) => {
        return marineDox.filter(doc => doc.projectId === projectId);
    };

    // Flatten all tasks from all projects for easy access
    const allTasks = projects.flatMap(project =>
        project.sprints.flatMap(sprint =>
            sprint.tasks.map(task => ({
                ...task,
                projectId: project.id,
                projectName: project.name,
                sprintId: sprint.id,
                sprintName: sprint.name,
                assignee: task.assignee?.name,
                status: task.status === 'in-progress' ? 'In Progress' :
                    task.status === 'done' ? 'Done' :
                        task.status === 'review' ? 'In Review' :
                            'To Do',
                priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
            }))
        )
    );

    return (
        <DataContext.Provider
            value={{
                projects,
                notifications,
                marineDox,
                tasks: allTasks,
                addProject,
                updateProject,
                deleteProject,
                addSprint,
                updateSprint,
                deleteSprint,
                addTask,
                updateTask,
                deleteTask,
                markNotificationAsRead,
                markAllNotificationsAsRead,
                deleteNotification,
                addNotification,
                addMarineDox,
                updateMarineDox,
                deleteMarineDox,
                getMarineDoxByProject
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
}
