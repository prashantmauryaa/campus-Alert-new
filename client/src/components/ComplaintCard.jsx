import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Tag,
    AlertTriangle,
    User,
    ChevronDown,
    ChevronUp,
    MessageSquare,
    EyeOff,
    Clock,
    Send,
    CalendarClock
} from 'lucide-react';
import StatusStepper from './StatusStepper';
import api from '../services/api';
import toast from 'react-hot-toast';

const ComplaintCard = ({ complaint, isAdmin = false, onStatusUpdate, onMessageSent }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [expectedDate, setExpectedDate] = useState(complaint.expectedResolutionDate || '');
    const [isUpdatingDate, setIsUpdatingDate] = useState(false);

    const {
        _id,
        title,
        description,
        category,
        status,
        priority,
        isAnonymous,
        user,
        submittedBy,
        adminResponse,
        messages = [],
        expectedResolutionDate,
        createdAt,
        updatedAt
    } = complaint;

    const priorityColors = {
        Low: 'bg-green-500/10 text-green-400 border-green-500/30',
        Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        High: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        Urgent: 'bg-red-500/10 text-red-400 border-red-500/30'
    };

    const categoryColors = {
        Canteen: 'bg-amber-500/10 text-amber-400',
        Hostel: 'bg-blue-500/10 text-blue-400',
        Academics: 'bg-purple-500/10 text-purple-400',
        Infrastructure: 'bg-slate-500/10 text-slate-400',
        Transport: 'bg-cyan-500/10 text-cyan-400',
        Library: 'bg-emerald-500/10 text-emerald-400',
        Sports: 'bg-rose-500/10 text-rose-400',
        Other: 'bg-gray-500/10 text-gray-400'
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateOnly = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatMessageTime = (date) => {
        const now = new Date();
        const msgDate = new Date(date);
        const diffMs = now - msgDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDate(date);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setIsSending(true);
        try {
            await api.post(`/complaints/${_id}/messages`, { text: newMessage.trim() });
            setNewMessage('');
            if (onMessageSent) onMessageSent();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
        } finally {
            setIsSending(false);
        }
    };

    const handleUpdateExpectedDate = async () => {
        setIsUpdatingDate(true);
        try {
            await api.put(`/complaints/${_id}`, { expectedResolutionDate: expectedDate || null });
            if (onMessageSent) onMessageSent();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update date');
        } finally {
            setIsUpdatingDate(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl overflow-hidden card-hover"
        >
            {/* Header */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {/* Category Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[category] || categoryColors.Other}`}>
                                {category}
                            </span>

                            {/* Priority Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[priority]}`}>
                                {priority}
                            </span>

                            {/* Anonymous Badge */}
                            {isAnonymous && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-500/10 text-accent-400 flex items-center gap-1">
                                    <EyeOff className="w-3 h-3" />
                                    Anonymous
                                </span>
                            )}

                            {/* Messages Count Badge */}
                            {messages.length > 0 && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {messages.length} message{messages.length > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>

                        {/* Submitter info */}
                        <div className="flex items-center gap-4 text-sm text-dark-400 flex-wrap">
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {isAnonymous && !isAdmin ? submittedBy || 'Anonymous' : user?.name || 'Unknown'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(createdAt)}
                            </span>
                            {/* Expected Resolution Date */}
                            {expectedResolutionDate && (
                                <span className="flex items-center gap-1 text-primary-400">
                                    <CalendarClock className="w-4 h-4" />
                                    Expected: {formatDateOnly(expectedResolutionDate)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                </div>

                {/* Enhancement #4: Status Stepper - always visible */}
                <div className="mt-4">
                    <StatusStepper currentStatus={status} size="small" />
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-dark-700"
                    >
                        <div className="p-6 space-y-4">
                            {/* Description */}
                            <div>
                                <h4 className="text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Description
                                </h4>
                                <p className="text-dark-400 text-sm leading-relaxed bg-dark-800/50 rounded-xl p-4">
                                    {description}
                                </p>
                            </div>

                            {/* Admin Response (Legacy) */}
                            {adminResponse && (
                                <div>
                                    <h4 className="text-sm font-medium text-primary-400 mb-2 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Admin Response
                                    </h4>
                                    <p className="text-dark-300 text-sm leading-relaxed bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
                                        {adminResponse}
                                    </p>
                                </div>
                            )}

                            {/* Messages Section */}
                            {(messages.length > 0 || isAdmin) && (
                                <div>
                                    <h4 className="text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Messages ({messages.length})
                                    </h4>

                                    {/* Messages List */}
                                    {messages.length > 0 && (
                                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                            {messages.map((msg, index) => (
                                                <motion.div
                                                    key={msg._id || index}
                                                    initial={{ opacity: 0, x: msg.senderRole === 'admin' ? 20 : -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] rounded-2xl p-4 ${msg.senderRole === 'admin'
                                                            ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30'
                                                            : 'bg-dark-800/50 border border-dark-700'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-xs font-medium ${msg.senderRole === 'admin' ? 'text-primary-400' : 'text-dark-400'
                                                                }`}>
                                                                {msg.senderName}
                                                            </span>
                                                            {msg.senderRole === 'admin' && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary-500/20 text-primary-400">
                                                                    Admin
                                                                </span>
                                                            )}
                                                            <span className="text-[10px] text-dark-500">
                                                                {formatMessageTime(msg.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-dark-200">{msg.text}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Message Input - Available for both admin and student */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder={isAdmin ? "Send update to student..." : "Reply to admin..."}
                                            className="flex-1 px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={isSending || !newMessage.trim()}
                                            className="px-4 py-2.5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isSending ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Admin: Expected Resolution Date */}
                            {isAdmin && (
                                <div className="pt-4 border-t border-dark-700">
                                    <h4 className="text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
                                        <CalendarClock className="w-4 h-4" />
                                        Expected Resolution Date
                                    </h4>
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            value={expectedDate ? new Date(expectedDate).toISOString().split('T')[0] : ''}
                                            onChange={(e) => setExpectedDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="flex-1 px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                        />
                                        <button
                                            onClick={handleUpdateExpectedDate}
                                            disabled={isUpdatingDate}
                                            className="px-4 py-2.5 rounded-xl bg-accent-500/20 text-accent-400 font-medium hover:bg-accent-500/30 transition-colors disabled:opacity-50"
                                        >
                                            {isUpdatingDate ? 'Updating...' : 'Set Date'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Full Status Stepper */}
                            <div>
                                <h4 className="text-sm font-medium text-dark-300 mb-3">Progress Status</h4>
                                <StatusStepper currentStatus={status} size="default" />
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center gap-4 pt-4 border-t border-dark-700 text-xs text-dark-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Last updated: {formatDate(updatedAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                    ID: {_id?.slice(-8)}
                                </span>
                            </div>

                            {/* Admin Actions */}
                            {isAdmin && onStatusUpdate && (
                                <div className="pt-4 border-t border-dark-700">
                                    <h4 className="text-sm font-medium text-dark-300 mb-3">Update Status</h4>
                                    <div className="flex gap-2">
                                        {['Submitted', 'Reviewed', 'Resolved'].map((statusOption) => (
                                            <button
                                                key={statusOption}
                                                onClick={() => onStatusUpdate(_id, statusOption)}
                                                disabled={status === statusOption}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${status === statusOption
                                                    ? 'bg-primary-500/20 text-primary-400 cursor-not-allowed'
                                                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                                                    }`}
                                            >
                                                {statusOption}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ComplaintCard;
