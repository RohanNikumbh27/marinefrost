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
import { ArrowRight, Rocket, Shield, Users2 } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from '@/components/Logo';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const success = await register(email, password, name);
            if (success) {
                toast.success('Account created successfully!');
                router.push('/dashboard');
            }
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        { icon: Rocket, text: 'Get started in minutes' },
        { icon: Users2, text: 'Collaborate with unlimited team members' },
        { icon: Shield, text: 'Enterprise-grade security' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Signup Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
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
                        <h1 className="text-4xl font-bold font-dancing bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
                                <CardTitle className="text-4xl">Create account</CardTitle>
                                <CardDescription className="text-base">
                                    Start your journey with MarineFrost today
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-4">
                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                    >
                                        <Label htmlFor="name" className="text-base">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
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
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                    >
                                        <Label htmlFor="password" className="text-base">Password</Label>
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
                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7, duration: 0.4 }}
                                    >
                                        <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        transition={{ delay: 0.8, duration: 0.4 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            type="submit"
                                            className="w-full rounded-xl h-12 text-base font-semibold group"
                                            disabled={loading}
                                        >
                                            {loading ? 'Creating account...' : 'Sign Up'}
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                        className="text-base text-muted-foreground text-center"
                                    >
                                        Already have an account?{' '}
                                        <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400 font-semibold">
                                            Sign in
                                        </Link>
                                    </motion.p>
                                </CardFooter>
                            </form>
                        </Card>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.4 }}
                        className="text-center text-sm text-muted-foreground mt-8"
                    >
                        By signing up, you agree to our Terms of Service and Privacy Policy
                    </motion.p>
                </motion.div>
            </div>

            {/* Right Side - Branding & Benefits */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Background Image */}
                <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1621743018966-29194999d736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc2Nzc4NTA2NHww&ixlib=rb-4.1.0&q=80&w=1080')`
                }} />

                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex items-center space-x-3"
                    >
                        <Logo className="h-12 w-12" />
                        <span className="text-4xl font-bold font-dancing tracking-wide">MarineFrost</span>
                    </motion.div>

                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <h1 className="text-5xl font-bold font-dancing mb-4 leading-tight">
                                Join Thousands of<br />Happy Teams
                            </h1>
                            <p className="text-xl text-purple-100 leading-relaxed">
                                Everything you need to manage projects efficiently and ship faster.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="space-y-4"
                        >
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                                    className="flex items-center space-x-3"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <benefit.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-lg font-medium">{benefit.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                        >
                            <p className="text-lg italic mb-2">
                                &quot;MarineFrost transformed how our team collaborates. We&apos;re shipping faster than ever!&quot;
                            </p>
                            <p className="text-sm text-purple-200">
                                — Sarah Johnson, Product Manager
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                        className="text-purple-100 text-sm"
                    >
                        © 2025 MarineFrost. All rights reserved.
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
