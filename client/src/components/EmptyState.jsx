import { motion } from 'framer-motion';
import { FileX, Plus, Search, Inbox } from 'lucide-react';

/**
 * Enhancement #5: Empty State Component
 * Displays a beautiful illustration and message when there's no data
 */
const EmptyState = ({
    type = 'complaints',
    title,
    description,
    actionLabel,
    onAction,
    icon: CustomIcon
}) => {
    const presets = {
        complaints: {
            title: 'No Complaints Yet',
            description: "You haven't submitted any complaints. Start by raising your first concern!",
            actionLabel: 'Submit Complaint',
            icon: Inbox
        },
        search: {
            title: 'No Results Found',
            description: "We couldn't find any complaints matching your search criteria.",
            actionLabel: 'Clear Filters',
            icon: Search
        },
        empty: {
            title: 'Nothing Here',
            description: 'This section is empty.',
            actionLabel: null,
            icon: FileX
        }
    };

    const preset = presets[type] || presets.empty;
    const Icon = CustomIcon || preset.icon;
    const displayTitle = title || preset.title;
    const displayDescription = description || preset.description;
    const displayActionLabel = actionLabel || preset.actionLabel;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6"
        >
            {/* SVG Illustration */}
            <div className="relative mb-8">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-3xl scale-150" />

                {/* Main illustration container */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                >
                    {/* Main circle */}
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 flex items-center justify-center">
                            <Icon className="w-14 h-14 text-primary-400" />
                        </div>
                    </div>

                    {/* Floating decorative elements */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0"
                    >
                        <div className="absolute -top-2 left-1/2 w-3 h-3 rounded-full bg-primary-500/40" />
                        <div className="absolute top-1/2 -right-2 w-2 h-2 rounded-full bg-accent-500/40" />
                        <div className="absolute -bottom-2 left-1/3 w-2 h-2 rounded-full bg-primary-400/40" />
                    </motion.div>

                    {/* Orbiting dots */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0"
                    >
                        <div className="absolute top-4 -left-4 w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30" />
                        <div className="absolute bottom-4 -right-4 w-4 h-4 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 shadow-lg shadow-accent-500/30" />
                    </motion.div>
                </motion.div>

                {/* Decorative lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 160 160">
                    <motion.circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="1"
                        strokeDasharray="10 5"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: 'center' }}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Text Content */}
            <div className="text-center max-w-sm">
                <h3 className="text-2xl font-bold text-white mb-3">
                    {displayTitle}
                </h3>
                <p className="text-dark-400 mb-6 leading-relaxed">
                    {displayDescription}
                </p>

                {/* Action Button */}
                {displayActionLabel && onAction && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onAction}
                        className="btn-gradient px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 mx-auto"
                    >
                        <Plus className="w-5 h-5" />
                        {displayActionLabel}
                    </motion.button>
                )}
            </div>

            {/* Additional decorative elements */}
            <div className="mt-12 flex items-center gap-2 text-dark-600">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-dark-600" />
                <span className="text-xs">Start your journey</span>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-dark-600" />
            </div>
        </motion.div>
    );
};

export default EmptyState;
