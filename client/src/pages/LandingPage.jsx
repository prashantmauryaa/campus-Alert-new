import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Shield,
    Bell,
    Users,
    Clock,
    CheckCircle,
    ChevronRight,
    Sparkles,
    MessageSquare,
    BarChart3,
    Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Animated counter component for stats ticker
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        const startValue = 0;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (end - startValue) * easeOut);
            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
};

// Enhancement #1: Professional Landing Page
const LandingPage = () => {
    const navigate = useNavigate();
    const { seedDemoAccounts, login } = useAuth();
    const [isDemoLoading, setIsDemoLoading] = useState(false);

    // Demo Mode handler - auto-fills and logs in with demo credentials
    const handleDemoMode = async (role = 'student') => {
        setIsDemoLoading(true);
        try {
            // Seed demo accounts first
            await seedDemoAccounts();

            // Auto-login with demo credentials
            const credentials = role === 'admin'
                ? { email: 'admin@demo.com', password: 'admin123' }
                : { email: 'student@demo.com', password: 'demo123' };

            const result = await login(credentials.email, credentials.password);
            if (result.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Demo login failed:', error);
        } finally {
            setIsDemoLoading(false);
        }
    };

    const features = [
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: 'Easy Reporting',
            description: 'Submit grievances in seconds with our intuitive form'
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: 'Anonymous Option',
            description: 'Report issues anonymously for sensitive matters'
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: 'Real-time Tracking',
            description: 'Track your complaint status from submission to resolution'
        },
        {
            icon: <Bell className="w-6 h-6" />,
            title: 'Instant Updates',
            description: 'Get notified when your complaint status changes'
        }
    ];

    const stats = [
        { value: 1250, suffix: '+', label: 'Issues Resolved' },
        { value: 98, suffix: '%', label: 'Satisfaction Rate' },
        { value: 850, suffix: '+', label: 'Active Students' },
        { value: 24, suffix: 'hrs', label: 'Avg Response Time' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
            </div>

            {/* Header */}
            <header className="relative z-10">
                <nav className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">
                                Campus<span className="gradient-text">Alert</span>
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-dark-300 hover:text-white transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/login?register=true')}
                                className="btn-gradient px-6 py-2.5 rounded-xl text-white font-medium"
                            >
                                Get Started
                            </button>
                        </motion.div>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-6">
                <section className="py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
                                <Sparkles className="w-4 h-4 text-primary-400" />
                                <span className="text-primary-400 text-sm font-medium">College Grievance System</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                                Empowering{' '}
                                <span className="gradient-text">Student</span>{' '}
                                Voices
                            </h1>

                            <p className="text-xl text-dark-300 mb-8 max-w-xl">
                                A modern platform to report, track, and resolve campus issues efficiently.
                                Your voice matters, and we ensure it's heard.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/login')}
                                    className="btn-gradient px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center gap-2 group"
                                >
                                    <Users className="w-5 h-5" />
                                    Student Login
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/login?role=admin')}
                                    className="btn-accent px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center gap-2 group"
                                >
                                    <Shield className="w-5 h-5" />
                                    Admin Portal
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>

                            {/* Demo Mode Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDemoMode('student')}
                                disabled={isDemoLoading}
                                className="px-6 py-3 rounded-xl glass border border-primary-500/30 text-primary-400 font-medium flex items-center gap-2 hover:bg-primary-500/10 transition-all disabled:opacity-50"
                            >
                                {isDemoLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                                        Loading Demo...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Try Demo Account
                                    </>
                                )}
                            </motion.button>
                        </motion.div>

                        {/* Right - Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative">
                                {/* Main card */}
                                <div className="glass rounded-3xl p-8 card-hover">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                            <MessageSquare className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">New Complaint</h3>
                                            <p className="text-dark-400 text-sm">Track #CA-2024-1234</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="h-3 bg-dark-700 rounded-full w-full overflow-hidden">
                                            <div className="h-full w-2/3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-400 flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4" /> Submitted
                                            </span>
                                            <span className="text-primary-400 flex items-center gap-1">
                                                <Clock className="w-4 h-4" /> In Review
                                            </span>
                                            <span className="text-dark-500">Resolved</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating elements */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-8 -right-8 glass rounded-2xl p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Issue Resolved!</p>
                                            <p className="text-dark-400 text-xs">2 minutes ago</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -bottom-8 -left-8 glass rounded-2xl p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">850+ Students</p>
                                            <p className="text-dark-400 text-xs">Active users</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Live Stats Ticker */}
                <section className="py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass rounded-3xl p-8 lg:p-12"
                    >
                        <h2 className="text-center text-2xl font-bold text-white mb-10">
                            Trusted by Students Across Campus
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">
                                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <p className="text-dark-400 font-medium">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Features */}
                <section className="py-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Why Choose <span className="gradient-text">CampusAlert</span>?
                        </h2>
                        <p className="text-dark-400 max-w-2xl mx-auto">
                            We've built the most efficient grievance management system to ensure your concerns are addressed promptly.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-2xl p-6 card-hover group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-dark-400 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-accent-600 p-12 text-center"
                    >
                        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                Ready to Make Your Voice Heard?
                            </h2>
                            <p className="text-white/80 mb-8 max-w-xl mx-auto">
                                Join thousands of students who trust CampusAlert for their grievance management needs.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={() => navigate('/login?register=true')}
                                    className="px-8 py-4 rounded-2xl bg-white text-primary-600 font-semibold text-lg hover:bg-white/90 transition-colors"
                                >
                                    Create Account
                                </button>
                                <button
                                    onClick={() => handleDemoMode('student')}
                                    disabled={isDemoLoading}
                                    className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                                >
                                    Try Demo
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="py-8 border-t border-dark-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6 text-primary-500" />
                            <span className="text-dark-400">
                                © 2024 CampusAlert. All rights reserved.
                            </span>
                        </div>
                        <div className="flex items-center gap-6 text-dark-400">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default LandingPage;
