"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Trophy, Activity, GitBranch, Target, Mail, MapPin, Briefcase, Calendar, TrendingUp, CheckCircle, User } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useData } from '@/contexts/DataContext';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { projects, tasks } = useData();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    bio: user?.bio || '',
    location: user?.location || '',
    department: user?.department || '',
    phone: user?.phone || '',
    joinDate: user?.joinDate || '2024-01-15'
  });

  const handleSave = () => {
    updateProfile(formData);
    toast.success('Profile updated successfully');
  };

  // Calculate user statistics
  const userTasks = tasks.filter(task => task.assignee === user?.name);
  const completedTasks = userTasks.filter(task => task.status === 'Done');
  const activeSprints = projects.flatMap(p => p.sprints).filter(s => s.status === 'active').length;
  const completionRate = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
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
            <h1 className="text-3xl">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg">Profile</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg">Activity</TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-lg">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header Card */}
            <Card className="rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-3xl"><User className="h-12 w-12" /></AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <h2 className="text-2xl">{user?.name}</h2>
                    <p className="text-muted-foreground">{formData.role || 'Team Member'}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="rounded-lg">
                        <Mail className="h-3 w-3 mr-1" />
                        {user?.email}
                      </Badge>
                      {formData.location && (
                        <Badge variant="secondary" className="rounded-lg">
                          <MapPin className="h-3 w-3 mr-1" />
                          {formData.location}
                        </Badge>
                      )}
                      {formData.department && (
                        <Badge variant="secondary" className="rounded-lg">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {formData.department}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                    <div className="text-center p-3 bg-muted rounded-xl">
                      <div className="text-2xl font-semibold">{userTasks.length}</div>
                      <div className="text-xs text-muted-foreground">Total Tasks</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-xl">
                      <div className="text-2xl font-semibold">{completedTasks.length}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-xl">
                      <div className="text-2xl font-semibold">{activeSprints}</div>
                      <div className="text-xs text-muted-foreground">Active Sprints</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-xl">
                      <div className="text-2xl font-semibold">{completionRate}%</div>
                      <div className="text-xs text-muted-foreground">Completion</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Card */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="rounded-xl"
                      placeholder="e.g., Product Manager, Developer"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="rounded-xl"
                      placeholder="e.g., Engineering, Design"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="rounded-xl"
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-xl"
                      placeholder="e.g., +1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="rounded-xl"
                    rows={4}
                    placeholder="Tell us about yourself, your expertise, and what you're working on..."
                  />
                </div>

                <Button onClick={handleSave} className="rounded-xl">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Performance Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{completedTasks.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Tasks completed</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">This Month</span>
                      <span className="font-medium">{Math.floor(completedTasks.length * 0.4)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">This Week</span>
                      <span className="font-medium">{Math.floor(completedTasks.length * 0.15)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    Productivity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{completionRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Completion rate</p>
                  <div className="mt-4">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {completionRate >= 80 ? 'Excellent performance!' : completionRate >= 60 ? 'Good progress' : 'Keep going!'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-blue-500" />
                    Active Work
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{userTasks.filter(t => t.status === 'In Progress').length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Tasks in progress</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">To Do</span>
                      <span className="font-medium">{userTasks.filter(t => t.status === 'To Do').length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">In Review</span>
                      <span className="font-medium">{userTasks.filter(t => t.status === 'In Review').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest tasks and contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userTasks.slice(0, 6).map((task) => (
                    <div key={task.id} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-muted transition-colors">
                      <div className={`p-2 rounded-lg ${task.status === 'Done' ? 'bg-green-100 dark:bg-green-900/20' :
                        task.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/20' :
                          'bg-gray-100 dark:bg-gray-800'
                        }`}>
                        <CheckCircle className={`h-4 w-4 ${task.status === 'Done' ? 'text-green-600' :
                          task.status === 'In Progress' ? 'text-blue-600' :
                            'text-gray-600'
                          }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.projectName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="rounded-lg">
                          {task.status}
                        </Badge>
                        <Badge variant="secondary" className="rounded-lg">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects Involvement */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Projects you're contributing to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {projects.slice(0, 4).map((project) => {
                    const projectTasks = tasks.filter(t => t.projectId === project.id && t.assignee === user?.name);
                    return (
                      <div key={project.id} className="p-4 rounded-xl border hover:border-primary transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-muted-foreground">{project.key}</p>
                          </div>
                          <Badge variant="outline" className="rounded-lg">
                            {projectTasks.length} tasks
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              {projectTasks.length > 0
                                ? Math.round((projectTasks.filter(t => t.status === 'Done').length / projectTasks.length) * 100)
                                : 0}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${projectTasks.length > 0
                                  ? (projectTasks.filter(t => t.status === 'Done').length / projectTasks.length) * 100
                                  : 0}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize your interface appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your tasks
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Task Assignments</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when tasks are assigned to you
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sprint Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Updates about sprint progress and deadlines
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}