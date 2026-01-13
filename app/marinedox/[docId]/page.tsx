"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RichTextEditor from '@/components/RichTextEditor';
import { ArrowLeft, Edit, Trash2, Save, FileText, Calendar, User, X, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function MarineDoxDetailPage() {
    const { docId } = useParams() as { docId: string };
    const { marineDox, updateMarineDox, deleteMarineDox, projects } = useData();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const doc = marineDox.find(d => d.id === docId);

    useEffect(() => {
        if (doc) {
            setEditTitle(doc.title);
            setEditContent(doc.content);
        }
    }, [doc]);

    if (!doc) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-16">
                    <FileText className="h-16 w-16 mb-4 text-muted-foreground" />
                    <h2 className="text-xl mb-2">Document not found</h2>
                    <Button onClick={() => router.push('/marinedox')} className="mt-4 rounded-xl">
                        Back to MarineDox
                    </Button>
                </div>
            </Layout>
        );
    }

    const project = doc.projectId ? projects.find(p => p.id === doc.projectId) : null;

    const handleSave = () => {
        if (!editTitle.trim()) {
            toast.error('Title cannot be empty');
            return;
        }
        updateMarineDox(doc.id, { title: editTitle, content: editContent });
        setIsEditing(false);
        toast.success('Document updated!');
    };

    const handleDelete = () => {
        deleteMarineDox(doc.id);
        toast.success('Document deleted');
        router.push('/marinedox');
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Top Bar */}
                <div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 p-4 rounded-2xl backdrop-blur-md"
                    style={{
                        backgroundColor: 'var(--marinedox-glass-bg)',
                        border: '1px solid var(--marinedox-glass-border)'
                    }}
                >
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/marinedox')}
                            className="rounded-xl"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: 'var(--marinedox-secondary)' }}
                        >
                            <FileText className="h-5 w-5" style={{ color: 'var(--marinedox-primary)' }} />
                        </div>
                        <div>
                            {project && (
                                <Badge
                                    className="rounded-full text-xs"
                                    style={{
                                        backgroundColor: 'var(--marinedox-secondary)',
                                        color: 'var(--marinedox-primary-dark)'
                                    }}
                                >
                                    {project.name}
                                </Badge>
                            )}
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center space-x-1">
                                    <User className="h-3 w-3" />
                                    <span>{doc.author.name}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Updated {format(new Date(doc.updatedAt), 'MMM dd, yyyy')}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditTitle(doc.title);
                                        setEditContent(doc.content);
                                    }}
                                    className="rounded-xl"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="rounded-xl"
                                    style={{ backgroundColor: 'var(--marinedox-primary)' }}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="rounded-xl"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="rounded-xl"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {isEditing ? (
                    <>
                        {/* Title Input - Large Confluence-style */}
                        <div className="px-4">
                            <Input
                                placeholder="Untitled document"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="text-4xl font-semibold border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/50"
                                style={{ fontSize: '2.5rem', height: 'auto' }}
                            />
                        </div>

                        {/* Rich Text Editor */}
                        <RichTextEditor
                            content={editContent}
                            onChange={setEditContent}
                            placeholder="Start writing your documentation..."
                        />
                    </>
                ) : (
                    <>
                        {/* View Mode - Title */}
                        <div className="px-4">
                            <h1 className="text-4xl font-semibold" style={{ color: 'var(--marinedox-primary-dark)' }}>
                                {doc.title}
                            </h1>
                        </div>

                        {/* View Mode - Content */}
                        <div
                            className="rounded-2xl p-8 backdrop-blur-md"
                            style={{
                                backgroundColor: 'var(--marinedox-glass-bg)',
                                border: '1px solid var(--marinedox-glass-border)'
                            }}
                        >
                            <div
                                className="prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: doc.content }}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Delete Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Delete Document</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{doc.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} className="rounded-xl">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
