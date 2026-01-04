import { motion } from 'framer-motion';
import { CheckCircle, Clock, FileText } from 'lucide-react';

/**
 * Enhancement #4: Visual Status Timeline
 * A reusable horizontal progress stepper component
 * Shows: Submitted -> Reviewed -> Resolved
 */
const StatusStepper = ({ currentStatus = 'Submitted', size = 'default' }) => {
    const steps = [
        {
            status: 'Submitted',
            label: 'Submitted',
            icon: FileText,
            description: 'Complaint received'
        },
        {
            status: 'Reviewed',
            label: 'Reviewed',
            icon: Clock,
            description: 'Under review'
        },
        {
            status: 'Resolved',
            label: 'Resolved',
            icon: CheckCircle,
            description: 'Issue fixed'
        }
    ];

    const statusOrder = ['Submitted', 'Reviewed', 'Resolved'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    const getStepState = (stepIndex) => {
        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'active';
        return 'pending';
    };

    const sizeClasses = {
        small: {
            container: 'gap-1',
            step: 'w-8 h-8',
            icon: 'w-4 h-4',
            connector: 'h-0.5',
            label: 'text-xs',
            description: 'hidden'
        },
        default: {
            container: 'gap-2',
            step: 'w-10 h-10',
            icon: 'w-5 h-5',
            connector: 'h-1',
            label: 'text-sm',
            description: 'text-xs'
        },
        large: {
            container: 'gap-3',
            step: 'w-12 h-12',
            icon: 'w-6 h-6',
            connector: 'h-1.5',
            label: 'text-base',
            description: 'text-sm'
        }
    };

    const s = sizeClasses[size];

    return (
        <div className="w-full">
            <div className={`flex items-center justify-between ${s.container}`}>
                {steps.map((step, index) => {
                    const state = getStepState(index);
                    const Icon = step.icon;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.status} className="flex items-center flex-1">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`
                    ${s.step} rounded-full flex items-center justify-center transition-all duration-300
                    ${state === 'completed'
                                            ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30'
                                            : state === 'active'
                                                ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 ring-4 ring-primary-500/20'
                                                : 'bg-dark-700 border-2 border-dark-600'
                                        }
                  `}
                                >
                                    <Icon
                                        className={`
                      ${s.icon}
                      ${state === 'completed' || state === 'active'
                                                ? 'text-white'
                                                : 'text-dark-500'
                                            }
                    `}
                                    />
                                </motion.div>

                                {/* Label and Description */}
                                <div className="mt-2 text-center">
                                    <p className={`
                    ${s.label} font-medium
                    ${state === 'completed'
                                            ? 'text-green-400'
                                            : state === 'active'
                                                ? 'text-primary-400'
                                                : 'text-dark-500'
                                        }
                  `}>
                                        {step.label}
                                    </p>
                                    {size !== 'small' && (
                                        <p className={`
                      ${s.description} mt-0.5
                      ${state === 'pending' ? 'text-dark-600' : 'text-dark-400'}
                    `}>
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {!isLast && (
                                <div className={`flex-1 ${s.connector} mx-2 rounded-full overflow-hidden bg-dark-700 relative`}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: state === 'completed' || (state === 'active' && index < currentIndex)
                                                ? '100%'
                                                : state === 'active'
                                                    ? '50%'
                                                    : '0%'
                                        }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        className={`
                      h-full rounded-full
                      ${getStepState(index + 1) !== 'pending'
                                                ? 'bg-gradient-to-r from-green-500 to-green-400'
                                                : 'bg-gradient-to-r from-primary-500 to-primary-400'
                                            }
                    `}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Progress percentage */}
            <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-dark-700 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: currentStatus === 'Submitted'
                                    ? '33%'
                                    : currentStatus === 'Reviewed'
                                        ? '66%'
                                        : '100%'
                            }}
                            transition={{ duration: 0.6 }}
                            className={`h-full rounded-full ${currentStatus === 'Resolved'
                                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                                    : 'bg-gradient-to-r from-primary-500 to-accent-500'
                                }`}
                        />
                    </div>
                    <span className={`text-sm font-medium ${currentStatus === 'Resolved' ? 'text-green-400' : 'text-primary-400'
                        }`}>
                        {currentStatus === 'Submitted' ? '33%' : currentStatus === 'Reviewed' ? '66%' : '100%'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatusStepper;
