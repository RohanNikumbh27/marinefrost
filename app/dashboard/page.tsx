"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, FolderKanban, Calendar, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { projects, addProject } = useData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    key: '',
    color: '#0052CC'
  });
  const router = useRouter();

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.key) {
      toast.error('Please fill in all required fields');
      return;
    }

    addProject({
      ...newProject,
      members: []
    });

    toast.success('Project created successfully!');
    setIsCreateDialogOpen(false);
    setNewProject({
      name: '',
      description: '',
      key: '',
      color: '#0052CC'
    });
  };

  const getProjectStats = (project: any) => {
    const totalTasks = project.sprints.reduce((acc: number, sprint: any) => acc + sprint.tasks.length, 0);
    const completedTasks = project.sprints.reduce(
      (acc: number, sprint: any) => acc + sprint.tasks.filter((t: any) => t.status === 'done').length,
      0
    );
    return { totalTasks, completedTasks };
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold">Projects</h1>
            <p className="text-muted-foreground text-sm md:text-base">Manage your project portfolio</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shrink-0" size="sm">
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">New Project</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Add a new project to start tracking your work.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Website Redesign"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="key">Project Key *</Label>
                  <Input
                    id="key"
                    placeholder="e.g., WR (uppercase)"
                    value={newProject.key}
                    onChange={(e) => setNewProject({ ...newProject, key: e.target.value.toUpperCase() })}
                    className="rounded-xl"
                    maxLength={5}
                  />
                  <p className="text-xs text-muted-foreground">Used for task IDs (e.g., WR-123)</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the project"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="rounded-xl"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Project Color</Label>
                  <div className="flex space-x-2">
                    {['#0052CC', '#00B8D9', '#36B37E', '#FFAB00', '#FF5630', '#6554C0'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-10 w-10 rounded-xl border-2 transition-all ${newProject.color === color ? 'border-foreground scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewProject({ ...newProject, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} className="rounded-xl">
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <FolderKanban className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first project to get started</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const { totalTasks, completedTasks } = getProjectStats(project);
              const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 rounded-2xl border-2 hover:border-blue-500 dark:hover:border-blue-600 h-full"
                    onClick={() => {
                      if (project.sprints.length > 0) {
                        router.push(`/project/${project.id}/sprint/${project.sprints[0].id}`);
                      }
                    }}
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div
                          className="h-12 w-12 rounded-xl flex items-center justify-center text-white"
                          style={{ backgroundColor: project.color }}
                        >
                          <span className="font-bold">{project.key}</span>
                        </div>
                        <Badge className="rounded-full" variant="secondary">
                          {project.sprints.length} {project.sprints.length === 1 ? 'Sprint' : 'Sprints'}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col items-center space-y-1 text-center">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{totalTasks} tasks</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1 text-center">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{project.members.length} members</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1 text-center">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 5).map((member) => (
                          <div
                            key={member.id}
                            className="h-8 w-8 rounded-full border-2 border-background overflow-hidden"
                            title={member.name}
                          >
                            <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                          </div>
                        ))}
                        {project.members.length > 5 && (
                          <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs">
                            +{project.members.length - 5}
                          </div>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}