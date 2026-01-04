import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Shield,
    Mail,
    Lock,
    User,
    Building2,
    Hash,
    Eye,
    EyeOff,
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login, register, seedDemoAccounts } = useAuth();

    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        rollNumber: '',
        role: 'student'
    });

    useEffect(() => {
        if (searchParams.get('register') === 'true') {
            setIsRegister(true);
        }
        if (searchParams.get('role') === 'admin') {
            setFormData(prev => ({ ...prev, role: 'admin' }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isRegister) {
                const result = await register(formData);
                if (result.success) {
                    navigate('/dashboard');
                }
            } else {
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    navigate('/dashboard');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Demo Mode - auto-fill credentials
    const handleDemoMode = async (role = 'student') => {
        setIsDemoLoading(true);
        try {
            await seedDemoAccounts();

            const credentials = role === 'admin'
                ? { email: 'admin@demo.com', password: 'admin123' }
                : { email: 'student@demo.com', password: 'demo123' };

            setFormData(prev => ({
                ...prev,
                email: credentials.email,
                password: credentials.password
            }));
        } finally {
            setIsDemoLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10 max-w-lg"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-white">
                            Campus<span className="gradient-text">Alert</span>
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-4">
                        Welcome {isRegister ? 'to the' : 'Back to'}{' '}
                        <span className="gradient-text">Community</span>
                    </h1>

                    <p className="text-dark-300 text-lg mb-8">
                        {isRegister
                            ? "Join thousands of students making their campus a better place. Your voice matters!"
                            : "Track your complaints, get updates, and help improve your campus experience."
                        }
                    </p>

                    {/* Features list */}
                    <div className="space-y-4">
                        {[
                            'Submit complaints in seconds',
                            'Track status in real-time',
                            'Anonymous reporting available',
                            '24/7 support available'
                        ].map((feature, index) => (
                            <motion.div
                                key={feature}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-center gap-3 text-dark-300"
                            >
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                                {feature}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Back button */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-dark-400 hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </button>

                    {/* Form Card */}
                    <div className="glass rounded-3xl p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {isRegister ? 'Create Account' : 'Sign In'}
                            </h2>
                            <p className="text-dark-400">
                                {isRegister
                                    ? 'Fill in your details to get started'
                                    : 'Enter your credentials to continue'
                                }
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {isRegister && (
                                <>
                                    {/* Name */}
                                    <div>
                                        <label className="block text-dark-300 text-sm font-medium mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    {/* Department */}
                                    <div>
                                        <label className="block text-dark-300 text-sm font-medium mb-2">
                                            Department
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                                placeholder="Computer Science"
                                            />
                                        </div>
                                    </div>

                                    {/* Roll Number */}
                                    <div>
                                        <label className="block text-dark-300 text-sm font-medium mb-2">
                                            Roll Number
                                        </label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                            <input
                                                type="text"
                                                name="rollNumber"
                                                value={formData.rollNumber}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                                placeholder="CS2024001"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-dark-300 text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-dark-300 text-sm font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-12 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-gradient py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    isRegister ? 'Create Account' : 'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Demo Mode Buttons */}
                        <div className="mt-6 pt-6 border-t border-dark-700">
                            <p className="text-center text-dark-400 text-sm mb-4">Try Demo Mode</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleDemoMode('student')}
                                    disabled={isDemoLoading}
                                    className="py-2 px-4 rounded-xl border border-primary-500/30 text-primary-400 text-sm font-medium hover:bg-primary-500/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Student Demo
                                </button>
                                <button
                                    onClick={() => handleDemoMode('admin')}
                                    disabled={isDemoLoading}
                                    className="py-2 px-4 rounded-xl border border-accent-500/30 text-accent-400 text-sm font-medium hover:bg-accent-500/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Shield className="w-4 h-4" />
                                    Admin Demo
                                </button>
                            </div>
                        </div>

                        {/* Toggle Register/Login */}
                        <p className="text-center text-dark-400 mt-6">
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-primary-400 hover:text-primary-300 font-medium"
                            >
                                {isRegister ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
