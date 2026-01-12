"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from '@/components/Logo';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                toast.success('Welcome back!');
                router.push('/dashboard');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: CheckCircle2, text: 'Project Management' },
        { icon: Zap, text: 'Real-time Collaboration' },
        { icon: Sparkles, text: 'Smart Workflows' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image & Branding */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Background Image */}
                <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1627634771105-08a3a12ad228?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0JTIwbWFuYWdlbWVudCUyMHRlYW18ZW58MXx8fHwxNzY3NzA4NDQwfDA&ixlib=rb-4.1.0&q=80&w=1080')`
                }} />

                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex items-center space-x-3"
                    >
                        <Logo className="h-12 w-12" />
                        <span className="text-3xl font-bold">MarineFrost</span>
                    </motion.div>

                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <h1 className="text-5xl font-bold mb-4 leading-tight">
                                Manage Projects<br />Like a Pro
                            </h1>
                            <p className="text-xl text-blue-100 leading-relaxed">
                                Streamline your workflow and collaborate with your team in real-time.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="space-y-4"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                                    className="flex items-center space-x-3"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-lg font-medium">{feature.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="text-blue-100 text-sm"
                    >
                        © 2025 MarineFrost. All rights reserved.
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="lg:hidden flex flex-col items-center mb-8"
                    >
                        <Logo className="h-16 w-16 mb-4" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            MarineFrost
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <Card className="rounded-3xl border-2 shadow-xl">
                            <CardHeader className="space-y-2 pb-6">
                                <CardTitle className="text-4xl">Welcome back</CardTitle>
                                <CardDescription className="text-base">
                                    Enter your credentials to access your account
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-5">
                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                    >
                                        <Label htmlFor="email" className="text-base">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="rounded-xl h-12 text-base"
                                        />
                                    </motion.div>
                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-base">Password</Label>
                                            <Link href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                                                Forgot?
                                            </Link>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="rounded-xl h-12 text-base"
                                        />
                                    </motion.div>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-4 pt-2">
                                    <motion.div
                                        className="w-full"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            type="submit"
                                            className="w-full rounded-xl h-12 text-base font-semibold group"
                                            disabled={loading}
                                        >
                                            {loading ? 'Signing in...' : 'Sign In'}
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7, duration: 0.4 }}
                                        className="text-base text-muted-foreground text-center"
                                    >
                                        Don&apos;t have an account?{' '}
                                        <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400 font-semibold">
                                            Sign up
                                        </Link>
                                    </motion.p>
                                </CardFooter>
                            </form>
                        </Card>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                        className="text-center text-sm text-muted-foreground mt-8"
                    >
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}
