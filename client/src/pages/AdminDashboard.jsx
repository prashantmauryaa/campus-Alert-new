import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LogOut,
    Shield,
    User,
    Bell,
    Search,
    RefreshCw,
    Users,
    FileText,
    CheckCircle,
    Clock,
    AlertTriangle,
    BarChart3,
    MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import ComplaintCard from '../components/ComplaintCard';
import EmptyState from '../components/EmptyState';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const categories = ['Canteen', 'Hostel', 'Academics', 'Infrastructure', 'Transport', 'Library', 'Sports', 'Other'];
    const statuses = ['Submitted', 'Reviewed', 'Resolved'];

    useEffect(() => {
        fetchData();
    }, [filterStatus, filterCategory]);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Fetch complaints
            const params = new URLSearchParams();
            if (filterStatus) params.append('status', filterStatus);
            if (filterCategory) params.append('category', filterCategory);

            const [complaintsRes, statsRes] = await Promise.all([
                api.get(`/complaints?${params.toString()}`),
                api.get('/stats')
            ]);

            setComplaints(complaintsRes.data.complaints || []);
            setStats(statsRes.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            await api.put(`/complaints/${complaintId}`, { status: newStatus });
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch =
            complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.description.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'pending') return matchesSearch && complaint.status === 'Submitted';
        if (activeTab === 'reviewed') return matchesSearch && complaint.status === 'Reviewed';
        if (activeTab === 'resolved') return matchesSearch && complaint.status === 'Resolved';
        return matchesSearch;
    });

    const localStats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Submitted').length,
        reviewed: complaints.filter(c => c.status === 'Reviewed').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
        anonymous: complaints.filter(c => c.isAnonymous).length
    };

    const statCards = [
        {
            label: 'Total Complaints',
            value: stats?.totalComplaints || localStats.total,
            icon: FileText,
            color: 'primary',
            bgColor: 'from-primary-500/20 to-primary-600/10'
        },
        {
            label: 'Pending Review',
            value: localStats.pending,
            icon: Clock,
            color: 'yellow',
            bgColor: 'from-yellow-500/20 to-yellow-600/10'
        },
        {
            label: 'In Progress',
            value: localStats.reviewed,
            icon: AlertTriangle,
            color: 'blue',
            bgColor: 'from-blue-500/20 to-blue-600/10'
        },
        {
            label: 'Resolved',
            value: stats?.resolvedComplaints || localStats.resolved,
            icon: CheckCircle,
            color: 'green',
            bgColor: 'from-green-500/20 to-green-600/10'
        },
        {
            label: 'Satisfaction Rate',
            value: `${stats?.satisfactionRate || 98}%`,
            icon: BarChart3,
            color: 'accent',
            bgColor: 'from-accent-500/20 to-accent-600/10'
        },
        {
            label: 'Anonymous Reports',
            value: localStats.anonymous,
            icon: Users,
            color: 'slate',
            bgColor: 'from-slate-500/20 to-slate-600/10'
        }
    ];

    const tabs = [
        { id: 'all', label: 'All', count: localStats.total },
        { id: 'pending', label: 'Pending', count: localStats.pending },
        { id: 'reviewed', label: 'In Review', count: localStats.reviewed },
        { id: 'resolved', label: 'Resolved', count: localStats.resolved }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 glass border-b border-dark-700">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-accent-500 to-primary-500">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white">
                                    Campus<span className="gradient-text">Alert</span>
                                </span>
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-accent-500/20 text-accent-400 rounded-full">
                                    Admin
                                </span>
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-xl hover:bg-dark-700 text-dark-400 hover:text-white transition-colors relative">
                                <Bell className="w-5 h-5" />
                                {localStats.pending > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                        {localStats.pending}
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-dark-800">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-white">{user?.name}</p>
                                    <p className="text-xs text-accent-400 capitalize">{user?.role}</p>
                                </div>
                            </div>

                            <button
                                onClick={logout}
                                className="p-2 rounded-xl hover:bg-dark-700 text-dark-400 hover:text-red-400 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-dark-400">Manage and resolve student complaints efficiently.</p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
                >
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`glass rounded-2xl p-4 card-hover bg-gradient-to-br ${stat.bgColor}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-dark-400 text-xs mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Tabs and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    {/* Tabs */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                                    ? 'bg-white/20'
                                    : 'bg-dark-700'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, description, or user..."
                                className="w-full pl-12 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:border-primary-500 transition-colors cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        {/* Refresh */}
                        <button
                            onClick={fetchData}
                            disabled={isLoading}
                            className="p-2.5 rounded-xl bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </motion.div>

                {/* Complaints List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                        </div>
                    ) : filteredComplaints.length === 0 ? (
                        <EmptyState
                            type={searchQuery || filterCategory ? 'search' : 'empty'}
                            title={activeTab !== 'all' ? `No ${activeTab} complaints` : undefined}
                            onAction={searchQuery || filterCategory
                                ? () => {
                                    setSearchQuery('');
                                    setFilterCategory('');
                                }
                                : undefined
                            }
                        />
                    ) : (
                        <div className="space-y-4">
                            {filteredComplaints.map((complaint, index) => (
                                <motion.div
                                    key={complaint._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ComplaintCard
                                        complaint={complaint}
                                        isAdmin={true}
                                        onStatusUpdate={handleStatusUpdate}
                                        onMessageSent={fetchData}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions Footer */}
                {localStats.pending > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 glass rounded-2xl px-6 py-4 flex items-center gap-4"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                            <span className="text-white font-medium">
                                {localStats.pending} complaint{localStats.pending > 1 ? 's' : ''} awaiting review
                            </span>
                        </div>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className="btn-gradient px-4 py-2 rounded-xl text-sm font-medium text-white"
                        >
                            Review Now
                        </button>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
