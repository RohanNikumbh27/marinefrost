"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, FileText, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function NewMarineDoxPage() {
    const { addMarineDox, projects } = useData();
    const { user } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [projectId, setProjectId] = useState<string>('none');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }
        if (!content.trim() || content === '<p></p>') {
            toast.error('Please enter some content');
            return;
        }

        setIsSaving(true);

        addMarineDox({
            title,
            content,
            projectId: projectId === 'none' ? undefined : projectId,
            author: {
                id: user?.id || '1',
                name: user?.name || 'Anonymous',
                avatar: user?.avatar
            }
        });

        toast.success('Document saved!');
        router.push('/marinedox');
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Top Bar - Confluence Style */}
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
                            <p className="text-sm text-muted-foreground">Creating new document</p>
                            <Select value={projectId} onValueChange={setProjectId}>
                                <SelectTrigger className="h-auto p-0 border-none bg-transparent text-xs hover:text-[var(--marinedox-primary)] focus:ring-0 [&>svg]:hidden">
                                    <SelectValue placeholder="No Project" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="none">No Project</SelectItem>
                                    {projects.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        onClick={handleSave}
                        className="rounded-xl"
                        style={{ backgroundColor: 'var(--marinedox-primary)' }}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Publish
                            </>
                        )}
                    </Button>
                </div>

                {/* Title Input - Large Confluence-style */}
                <div className="px-4">
                    <Input
                        placeholder="Untitled document"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-4xl font-semibold border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/50"
                        style={{ fontSize: '2.5rem', height: 'auto' }}
                    />
                </div>

                {/* Rich Text Editor */}
                <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Start writing your documentation..."
                />
            </div>
        </Layout>
    );
}
