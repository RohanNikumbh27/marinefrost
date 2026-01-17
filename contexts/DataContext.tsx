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
    assignedToTasks?: string[]; // Task IDs (format: "projectId:sprintId:taskId")
    folderIds?: string[]; // DocFolder IDs this document belongs to
    author: {
        id: string;
        name: string;
        avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Channel {
    id: string;
    name: string;
    description?: string;
    type: 'public' | 'private' | 'dm';
    members: string[]; // User IDs
    createdAt: string;
    updatedAt: string;
}

export interface Attachment {
    type: 'image' | 'file' | 'marinedox' | 'task';
    id: string;
    url?: string; // For images/files
    name: string;
    preview?: string; // For images
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    channelId: string;
    type: 'text' | 'image' | 'file';
    attachments?: Attachment[];
    reactions?: Record<string, string[]>; // emoji -> userIds[]
    timestamp: string;
}

export type UserStatusType = 'online' | 'meeting' | 'busy' | 'dnd' | 'offline' | 'lunch' | 'custom';

export interface UserStatus {
    type: UserStatusType;
    text?: string; // Custom status message
    emoji?: string; // Custom emoji
}

export interface ChatUser {
    id: string;
    name: string;
    avatar?: string;
    status: UserStatus;
}

export interface DocFolder {
    id: string;
    name: string;
    description?: string;
    icon: string; // emoji
    color: string;
    documentIds: string[]; // References to MarineDox documents
    assignedToProjects: string[]; // Project IDs
    assignedToTasks: string[]; // Task IDs (format: "projectId:sprintId:taskId")
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
    docFolders: DocFolder[];
    channels: Channel[];
    messages: Message[];
    chatUsers: ChatUser[];
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
    // DocFolder methods
    addDocFolder: (folder: Omit<DocFolder, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateDocFolder: (id: string, updates: Partial<DocFolder>) => void;
    deleteDocFolder: (id: string) => void;
    addDocToFolder: (folderId: string, docId: string) => void;
    removeDocFromFolder: (folderId: string, docId: string) => void;
    assignFolderToProject: (folderId: string, projectId: string) => void;
    assignFolderToTask: (folderId: string, taskKey: string) => void;
    assignDocToTask: (docId: string, taskKey: string) => void;
    getDocsByTask: (taskKey: string) => MarineDox[];
    getFoldersByProject: (projectId: string) => DocFolder[];
    // Chat methods
    createChannel: (name: string, description?: string, type?: 'public' | 'private') => void;
    joinChannel: (channelId: string, userId: string) => void;
    sendMessage: (content: string, channelId: string, senderId: string, type?: 'text' | 'image' | 'file', attachments?: Attachment[]) => void;
    getMessages: (channelId: string) => Message[];
    getChannels: (userId: string) => Channel[];
    startDirectMessage: (currentUserId: string, targetUserId: string) => string; // Returns channel ID
    updateUserStatus: (userId: string, status: UserStatus) => void;
    syncCurrentUser: (user: { id: string, name: string, avatar?: string }) => void;
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
    const [docFolders, setDocFolders] = useState<DocFolder[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatUsers, setChatUsers] = useState<ChatUser[]>([
        { id: '1', name: 'You', avatar: 'https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzcxNjQ1NHww&ixlib=rb-4.1.0&q=80&w=400', status: { type: 'online' } },
        { id: 'user_2', name: 'Alice Johnson', avatar: '/avatars/alice.jpg', status: { type: 'online' } },
        { id: 'user_3', name: 'Bob Smith', status: { type: 'busy' } },
        { id: 'user_4', name: 'Charlie Brown', avatar: '/avatars/charlie.jpg', status: { type: 'meeting', emoji: '📅', text: 'In a meeting' } },
        { id: 'user_5', name: 'Diana Prince', status: { type: 'offline' } },
        { id: 'user_6', name: 'Evan Wright', status: { type: 'dnd', emoji: '🚫', text: 'Do not disturb' } },
        { id: 'user_7', name: 'Fiona Gallagher', status: { type: 'lunch', emoji: '🍔', text: 'Out for lunch' } },
        { id: 'user_8', name: 'George Miller', status: { type: 'custom', emoji: '🎧', text: 'Focusing' } },
    ]);

    useEffect(() => {
        const savedProjects = localStorage.getItem('marinefrost_projects');
        const savedNotifications = localStorage.getItem('marinefrost_notifications');
        const savedMarineDox = localStorage.getItem('marinefrost_marinedox');
        const savedDocFolders = localStorage.getItem('marinefrost_docfolders');
        const savedDocSets = localStorage.getItem('marinefrost_docsets'); // For migration
        const savedChannels = localStorage.getItem('marinefrost_channels');
        const savedMessages = localStorage.getItem('marinefrost_messages');

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

        if (savedDocFolders) {
            setDocFolders(JSON.parse(savedDocFolders));
        } else if (savedDocSets) {
            // Migrate from sets to folders
            try {
                const oldSets = JSON.parse(savedDocSets);
                setDocFolders(oldSets);
                // We'll save to new key in the useEffect below
            } catch (e) {
                console.error("Failed to migrate doc sets", e);
            }
        }

        if (savedChannels) {
            setChannels(JSON.parse(savedChannels));
        } else {
            // Default channels
            setChannels([
                {
                    id: 'general',
                    name: 'general',
                    description: 'General discussion',
                    type: 'public',
                    members: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 'random',
                    name: 'random',
                    description: 'Random chatter',
                    type: 'public',
                    members: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ]);
        }

        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }

        // Load saved user status
        const savedUserStatus = localStorage.getItem('marinefrost_user_status');
        if (savedUserStatus) {
            try {
                const statusData = JSON.parse(savedUserStatus);
                setChatUsers(prev => prev.map(u => {
                    const savedStatus = statusData[u.id];
                    return savedStatus ? { ...u, status: savedStatus } : u;
                }));
            } catch (e) {
                console.error('Failed to load saved user status', e);
            }
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

    useEffect(() => {
        localStorage.setItem('marinefrost_docfolders', JSON.stringify(docFolders));
    }, [docFolders]);

    useEffect(() => {
        localStorage.setItem('marinefrost_channels', JSON.stringify(channels));
    }, [channels]);

    useEffect(() => {
        localStorage.setItem('marinefrost_messages', JSON.stringify(messages));
    }, [messages]);

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

    // DocFolder CRUD operations
    const addDocFolder = (folder: Omit<DocFolder, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newFolder: DocFolder = {
            ...folder,
            id: `folder_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setDocFolders([newFolder, ...docFolders]);
    };

    const updateDocFolder = (id: string, updates: Partial<DocFolder>) => {
        setDocFolders(docFolders.map(folder =>
            folder.id === id
                ? { ...folder, ...updates, updatedAt: new Date().toISOString() }
                : folder
        ));
    };

    const deleteDocFolder = (id: string) => {
        // Also remove folderId references from documents
        setMarineDox(marineDox.map(doc => ({
            ...doc,
            folderIds: doc.folderIds?.filter(fId => fId !== id)
        })));
        setDocFolders(docFolders.filter(folder => folder.id !== id));
    };

    const addDocToFolder = (folderId: string, docId: string) => {
        // Add doc to folder's documentIds
        setDocFolders(docFolders.map(folder =>
            folder.id === folderId && !folder.documentIds.includes(docId)
                ? { ...folder, documentIds: [...folder.documentIds, docId], updatedAt: new Date().toISOString() }
                : folder
        ));
        // Add folderId to document's folderIds
        setMarineDox(marineDox.map(doc =>
            doc.id === docId && !doc.folderIds?.includes(folderId)
                ? { ...doc, folderIds: [...(doc.folderIds || []), folderId], updatedAt: new Date().toISOString() }
                : doc
        ));
    };

    const removeDocFromFolder = (folderId: string, docId: string) => {
        setDocFolders(docFolders.map(folder =>
            folder.id === folderId
                ? { ...folder, documentIds: folder.documentIds.filter(id => id !== docId), updatedAt: new Date().toISOString() }
                : folder
        ));
        setMarineDox(marineDox.map(doc =>
            doc.id === docId
                ? { ...doc, folderIds: doc.folderIds?.filter(id => id !== folderId), updatedAt: new Date().toISOString() }
                : doc
        ));
    };

    const assignFolderToProject = (folderId: string, projectId: string) => {
        setDocFolders(docFolders.map(folder =>
            folder.id === folderId && !folder.assignedToProjects.includes(projectId)
                ? { ...folder, assignedToProjects: [...folder.assignedToProjects, projectId], updatedAt: new Date().toISOString() }
                : folder
        ));
    };

    const assignFolderToTask = (folderId: string, taskKey: string) => {
        setDocFolders(docFolders.map(folder =>
            folder.id === folderId && !folder.assignedToTasks.includes(taskKey)
                ? { ...folder, assignedToTasks: [...folder.assignedToTasks, taskKey], updatedAt: new Date().toISOString() }
                : folder
        ));
    };

    const assignDocToTask = (docId: string, taskKey: string) => {
        setMarineDox(marineDox.map(doc =>
            doc.id === docId && !doc.assignedToTasks?.includes(taskKey)
                ? { ...doc, assignedToTasks: [...(doc.assignedToTasks || []), taskKey], updatedAt: new Date().toISOString() }
                : doc
        ));
    };

    const getDocsByTask = (taskKey: string) => {
        // Get directly assigned docs
        const directDocs = marineDox.filter(doc => doc.assignedToTasks?.includes(taskKey));
        // Get docs from folders assigned to this task
        const folderIds = docFolders.filter(folder => folder.assignedToTasks.includes(taskKey)).map(f => f.id);
        const docsFromFolders = marineDox.filter(doc => doc.folderIds?.some(fId => folderIds.includes(fId)));
        // Combine and deduplicate
        const allDocs = [...directDocs, ...docsFromFolders];
        return allDocs.filter((doc, index, self) => self.findIndex(d => d.id === doc.id) === index);
    };

    const getFoldersByProject = (projectId: string) => {
        return docFolders.filter(folder => folder.assignedToProjects.includes(projectId));
    };

    // Chat operations
    const createChannel = (name: string, description: string = '', type: 'public' | 'private' = 'public') => {
        const newChannel: Channel = {
            id: `channel_${Date.now()}`,
            name,
            description,
            type,
            members: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setChannels([...channels, newChannel]);
    };

    const joinChannel = (channelId: string, userId: string) => {
        setChannels(channels.map(channel =>
            channel.id === channelId && !channel.members.includes(userId)
                ? { ...channel, members: [...channel.members, userId] }
                : channel
        ));
    };

    const sendMessage = (content: string, channelId: string, senderId: string, type: 'text' | 'image' | 'file' = 'text', attachments: Attachment[] = []) => {
        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            content,
            channelId,
            senderId,
            type,
            attachments,
            timestamp: new Date().toISOString()
        };
        setMessages([...messages, newMessage]);
    };

    const getMessages = (channelId: string) => {
        return messages.filter(m => m.channelId === channelId);
    };

    const getChannels = (userId: string) => {
        // Return public channels and private/dm channels where user is a member
        return channels.filter(c => c.type === 'public' || c.members.includes(userId));
    };

    const startDirectMessage = (currentUserId: string, targetUserId: string): string => {
        // Check if DM channel already exists
        const existingChannel = channels.find(c =>
            c.type === 'dm' &&
            c.members.includes(currentUserId) &&
            c.members.includes(targetUserId)
        );

        if (existingChannel) {
            return existingChannel.id;
        }

        // Create new DM channel
        const newChannel: Channel = {
            id: `dm_${Date.now()}`,
            name: '', // DM channels don't necessarily need a fixed name, computed dynamically
            type: 'dm',
            members: [currentUserId, targetUserId],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setChannels([...channels, newChannel]);
        return newChannel.id;
    };

    const updateUserStatus = (userId: string, status: UserStatus) => {
        setChatUsers(prev => {
            const updated = prev.map(u => u.id === userId ? { ...u, status } : u);
            // Persist status to localStorage
            const statusMap: Record<string, UserStatus> = {};
            updated.forEach(u => { statusMap[u.id] = u.status; });
            localStorage.setItem('marinefrost_user_status', JSON.stringify(statusMap));
            return updated;
        });
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

    const syncCurrentUser = (user: { id: string, name: string, avatar?: string }) => {
        if (!chatUsers.some(u => u.id === user.id)) {
            const newChatUser: ChatUser = {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                status: { type: 'online' }
            };
            setChatUsers(prev => [...prev, newChatUser]);
        }
    };

    return (
        <DataContext.Provider
            value={{
                projects,
                notifications,
                marineDox,
                docFolders,
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
                getMarineDoxByProject,
                addDocFolder,
                updateDocFolder,
                deleteDocFolder,
                addDocToFolder,
                removeDocFromFolder,
                assignFolderToProject,
                assignFolderToTask,
                assignDocToTask,
                getDocsByTask,
                getFoldersByProject,
                channels,
                messages,
                chatUsers,
                createChannel,
                joinChannel,
                sendMessage,
                getMessages,
                getChannels,
                startDirectMessage,
                updateUserStatus,
                syncCurrentUser
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
