import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    LogOut,
    Shield,
    User,
    Bell,
    Search,
    Filter,
    LayoutGrid,
    List,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintCard from '../components/ComplaintCard';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const categories = ['Canteen', 'Hostel', 'Academics', 'Infrastructure', 'Transport', 'Library', 'Sports', 'Other'];
    const statuses = ['Submitted', 'Reviewed', 'Resolved'];

    useEffect(() => {
        fetchComplaints();
    }, [filterStatus, filterCategory]);

    const fetchComplaints = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (filterStatus) params.append('status', filterStatus);
            if (filterCategory) params.append('category', filterCategory);

            const response = await api.get(`/complaints?${params.toString()}`);
            setComplaints(response.data.complaints || []);
        } catch (error) {
            toast.error('Failed to fetch complaints');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSuccess = () => {
        fetchComplaints();
    };

    const filteredComplaints = complaints.filter(complaint =>
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Submitted').length,
        reviewed: complaints.filter(c => c.status === 'Reviewed').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 glass border-b border-dark-700">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Campus<span className="gradient-text">Alert</span>
                            </span>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-xl hover:bg-dark-700 text-dark-400 hover:text-white transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
                            </button>

                            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-dark-800">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-white">{user?.name}</p>
                                    <p className="text-xs text-dark-400 capitalize">{user?.role}</p>
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
                        Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>!
                    </h1>
                    <p className="text-dark-400">Track and manage your complaints from here.</p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: 'Total', value: stats.total, color: 'primary' },
                        { label: 'Pending', value: stats.pending, color: 'yellow' },
                        { label: 'In Review', value: stats.reviewed, color: 'blue' },
                        { label: 'Resolved', value: stats.resolved, color: 'green' }
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            className="glass rounded-2xl p-4 card-hover"
                        >
                            <p className="text-dark-400 text-sm mb-1">{stat.label}</p>
                            <p className={`text-3xl font-bold text-${stat.color === 'primary' ? 'white' : stat.color + '-400'}`}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Actions Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6"
                >
                    {/* Search and Filters */}
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 lg:flex-initial">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search complaints..."
                                className="w-full lg:w-64 pl-12 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:border-primary-500 transition-colors cursor-pointer"
                        >
                            <option value="">All Status</option>
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

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
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex items-center gap-1 p-1 bg-dark-800 rounded-xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'
                                    }`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Refresh */}
                        <button
                            onClick={fetchComplaints}
                            disabled={isLoading}
                            className="p-2.5 rounded-xl bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>

                        {/* New Complaint Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsFormOpen(true)}
                            className="btn-gradient px-6 py-2.5 rounded-xl text-white font-medium flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            New Complaint
                        </motion.button>
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
                        // Enhancement #5: Empty State
                        <EmptyState
                            type={searchQuery || filterStatus || filterCategory ? 'search' : 'complaints'}
                            onAction={searchQuery || filterStatus || filterCategory
                                ? () => {
                                    setSearchQuery('');
                                    setFilterStatus('');
                                    setFilterCategory('');
                                }
                                : () => setIsFormOpen(true)
                            }
                        />
                    ) : (
                        <div className={
                            viewMode === 'grid'
                                ? 'grid md:grid-cols-2 gap-4'
                                : 'space-y-4'
                        }>
                            {filteredComplaints.map((complaint, index) => (
                                <motion.div
                                    key={complaint._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ComplaintCard complaint={complaint} onMessageSent={fetchComplaints} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>

            {/* Complaint Form Modal */}
            <ComplaintForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleFormSuccess}
            />
        </div>
    );
};

export default Dashboard;
