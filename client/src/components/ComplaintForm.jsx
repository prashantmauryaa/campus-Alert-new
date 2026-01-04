import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Send,
    Tag,
    FileText,
    AlertTriangle,
    Sparkles,
    EyeOff,
    Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

/**
 * Enhancement #3: Pseudo-AI Auto-Categorization
 * Keyword dictionary for automatic category detection
 */
const categoryKeywords = {
    'Canteen': ['food', 'mess', 'canteen', 'cafeteria', 'lunch', 'dinner', 'breakfast', 'meal', 'eating', 'hygiene', 'quality', 'taste', 'kitchen', 'menu', 'price', 'costly', 'expensive', 'cook'],
    'Hostel': ['hostel', 'room', 'roommate', 'warden', 'bed', 'mattress', 'bathroom', 'toilet', 'shower', 'water', 'hot water', 'plumbing', 'leak', 'pest', 'cockroach', 'mosquito', 'cleaning', 'laundry', 'washing'],
    'Academics': ['class', 'lecture', 'professor', 'teacher', 'faculty', 'syllabus', 'exam', 'test', 'marks', 'grade', 'attendance', 'assignment', 'project', 'lab', 'practical', 'timetable', 'schedule', 'course'],
    'Infrastructure': ['building', 'classroom', 'ac', 'air conditioning', 'fan', 'light', 'electricity', 'power', 'wifi', 'internet', 'computer', 'projector', 'furniture', 'chair', 'desk', 'bench', 'door', 'window', 'renovation'],
    'Transport': ['bus', 'transport', 'shuttle', 'vehicle', 'driver', 'route', 'timing', 'late', 'delay', 'overcrowded', 'parking', 'traffic'],
    'Library': ['library', 'book', 'journal', 'borrow', 'return', 'fine', 'study', 'reading', 'noise', 'seat', 'photocopy', 'print', 'silence'],
    'Sports': ['sports', 'gym', 'ground', 'field', 'court', 'equipment', 'fitness', 'game', 'tournament', 'coach', 'training', 'exercise', 'playground']
};

/**
 * Auto-detect category based on description text
 */
const detectCategory = (text) => {
    const lowerText = text.toLowerCase();
    const scores = {};

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        scores[category] = 0;
        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                scores[category]++;
            }
        }
    }

    // Find category with highest score
    let bestCategory = null;
    let highestScore = 0;

    for (const [category, score] of Object.entries(scores)) {
        if (score > highestScore) {
            highestScore = score;
            bestCategory = category;
        }
    }

    return highestScore > 0 ? bestCategory : null;
};

const ComplaintForm = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        isAnonymous: false // Enhancement #2
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoDetectedCategory, setAutoDetectedCategory] = useState(null);
    const [showAIHint, setShowAIHint] = useState(false);

    const categories = [
        'Canteen',
        'Hostel',
        'Academics',
        'Infrastructure',
        'Transport',
        'Library',
        'Sports',
        'Other'
    ];

    const priorities = ['Low', 'Medium', 'High', 'Urgent'];

    // Enhancement #3: Auto-detect category when description changes
    useEffect(() => {
        if (formData.description.length > 10) {
            const detected = detectCategory(formData.description);
            if (detected && detected !== formData.category) {
                setAutoDetectedCategory(detected);
                setShowAIHint(true);

                // Auto-apply if no category selected
                if (!formData.category) {
                    setFormData(prev => ({ ...prev, category: detected }));
                }
            }
        } else {
            setAutoDetectedCategory(null);
            setShowAIHint(false);
        }
    }, [formData.description]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const applyDetectedCategory = () => {
        if (autoDetectedCategory) {
            setFormData(prev => ({ ...prev, category: autoDetectedCategory }));
            setShowAIHint(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Please enter a title');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Please enter a description');
            return;
        }
        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post('/complaints', formData);
            setFormData({
                title: '',
                description: '',
                category: '',
                priority: 'Medium',
                isAnonymous: false
            });
            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg glass rounded-3xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-dark-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">New Complaint</h2>
                                <p className="text-dark-400 mt-1">Submit your concern to the administration</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">
                                Title
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                    placeholder="Brief title for your complaint"
                                    maxLength={200}
                                />
                            </div>
                        </div>

                        {/* Description with AI hint */}
                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">
                                Description
                                {showAIHint && autoDetectedCategory !== formData.category && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="ml-2 inline-flex items-center gap-1 text-primary-400"
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        <button
                                            type="button"
                                            onClick={applyDetectedCategory}
                                            className="text-xs hover:underline"
                                        >
                                            AI suggests: {autoDetectedCategory}
                                        </button>
                                    </motion.span>
                                )}
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none"
                                placeholder="Describe your issue in detail. Our AI will help categorize it automatically!"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">
                                Category
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">
                                Priority
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {priorities.map(priority => (
                                    <button
                                        key={priority}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, priority }))}
                                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${formData.priority === priority
                                            ? priority === 'Urgent'
                                                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                                : priority === 'High'
                                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                                                    : priority === 'Medium'
                                                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                                        : 'bg-green-500/20 text-green-400 border border-green-500/50'
                                            : 'bg-dark-700 text-dark-400 border border-dark-600 hover:border-dark-500'
                                            }`}
                                    >
                                        {priority}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Enhancement #2: Anonymous Toggle */}
                        <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700">
                            <div className="flex items-start gap-4">
                                <label className="toggle-switch shrink-0">
                                    <input
                                        type="checkbox"
                                        name="isAnonymous"
                                        checked={formData.isAnonymous}
                                        onChange={handleChange}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <EyeOff className="w-5 h-5 text-accent-400" />
                                        <span className="text-white font-medium">Submit Anonymously</span>
                                    </div>
                                    <p className="text-dark-400 text-sm mt-1">
                                        Your identity will be hidden from public view. Only admins can see who submitted this complaint.
                                    </p>
                                </div>
                            </div>

                            {formData.isAnonymous && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-start gap-2"
                                >
                                    <Info className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                                    <p className="text-accent-300 text-xs">
                                        Anonymous complaints are tracked internally but your name won't appear in status updates or responses.
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full btn-gradient py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    {formData.isAnonymous ? 'Submit Anonymously' : 'Submit Complaint'}
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ComplaintForm;
