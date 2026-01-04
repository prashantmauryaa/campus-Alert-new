import mongoose from 'mongoose';

// Enhancement #2: Added isAnonymous field for anonymous reporting
const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Canteen', 'Hostel', 'Academics', 'Infrastructure', 'Transport', 'Library', 'Sports', 'Other']
    },
    status: {
        type: String,
        enum: ['Submitted', 'Reviewed', 'Resolved'],
        default: 'Submitted'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    // Enhancement #2: Anonymous reporting toggle
    isAnonymous: {
        type: Boolean,
        default: false
    },
    // Store the actual user reference (always saved for admin tracking)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Admin response/feedback (legacy field)
    adminResponse: {
        type: String,
        trim: true
    },
    // NEW: Messages array for admin-student communication
    messages: [{
        text: {
            type: String,
            required: true,
            trim: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        senderRole: {
            type: String,
            enum: ['admin', 'student'],
            required: true
        },
        senderName: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Expected resolution date (optional - admin can set this)
    expectedResolutionDate: {
        type: Date
    },
    // Timeline tracking for status changes
    statusHistory: [{
        status: {
            type: String,
            enum: ['Submitted', 'Reviewed', 'Resolved']
        },
        changedAt: {
            type: Date,
            default: Date.now
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    attachments: [{
        filename: String,
        url: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
complaintSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to get public response (hides user info if anonymous)
complaintSchema.methods.toPublicJSON = function (includeUserInfo = true) {
    const obj = this.toObject();

    // Enhancement #2: If anonymous, remove user identification from public response
    if (this.isAnonymous && !includeUserInfo) {
        delete obj.user;
        obj.submittedBy = 'Anonymous';
    }

    return obj;
};

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
