"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useData, MarineDox } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Search, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'motion/react';

export default function MarineDoxListPage() {
    const { marineDox, projects } = useData();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterProject, setFilterProject] = useState<string>('all');

    const filteredDocs = marineDox
        .filter(doc =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(doc => filterProject === 'all' || doc.projectId === filterProject);

    const getProjectName = (projectId?: string) => {
        if (!projectId) return null;
        const project = projects.find(p => p.id === projectId);
        return project?.name || 'Unknown Project';
    };

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold" style={{ color: 'var(--marinedox-primary)' }}>
                            MarineDox
                        </h1>
                        <p className="text-muted-foreground">Create and manage your documentation</p>
                    </div>
                    <Button
                        onClick={() => router.push('/marinedox/new')}
                        className="rounded-xl"
                        style={{ backgroundColor: 'var(--marinedox-primary)' }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Document
                    </Button>
                </div>

                {/* Search & Filter */}
                <div
                    className="p-4 rounded-2xl backdrop-blur-md"
                    style={{
                        backgroundColor: 'var(--marinedox-glass-bg)',
                        border: '1px solid var(--marinedox-glass-border)'
                    }}
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-xl"
                            />
                        </div>
                        <Select value={filterProject} onValueChange={setFilterProject}>
                            <SelectTrigger className="w-full md:w-[200px] rounded-xl">
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

                {/* Documents Grid */}
                {filteredDocs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <FileText className="h-16 w-16 mb-4" style={{ color: 'var(--marinedox-primary-light)' }} />
                        <h3 className="text-xl mb-2">No documents yet</h3>
                        <p className="text-muted-foreground mb-6">Create your first MarineDox document</p>
                        <Button
                            onClick={() => router.push('/marinedox/new')}
                            className="rounded-xl"
                            style={{ backgroundColor: 'var(--marinedox-primary)' }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Document
                        </Button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocs.map((doc, index) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className="cursor-pointer h-full rounded-2xl transition-all duration-300 hover:shadow-lg backdrop-blur-md"
                                    style={{
                                        backgroundColor: 'var(--marinedox-glass-bg)',
                                        borderColor: 'var(--marinedox-glass-border)'
                                    }}
                                    onClick={() => router.push(`/marinedox/${doc.id}`)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div
                                                className="h-10 w-10 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: 'var(--marinedox-secondary)' }}
                                            >
                                                <FileText className="h-5 w-5" style={{ color: 'var(--marinedox-primary)' }} />
                                            </div>
                                            {doc.projectId && (
                                                <Badge
                                                    className="rounded-full"
                                                    style={{
                                                        backgroundColor: 'var(--marinedox-secondary)',
                                                        color: 'var(--marinedox-primary-dark)'
                                                    }}
                                                >
                                                    {getProjectName(doc.projectId)}
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className="line-clamp-1 mt-3">{doc.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {doc.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <div className="flex items-center space-x-1">
                                                <User className="h-3 w-3" />
                                                <span>{doc.author.name}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
