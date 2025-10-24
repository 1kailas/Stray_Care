import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'CASE_ASSIGNED', 'CASE_UPDATE', 'ADOPTION_UPDATE', 'DONATION_RECEIVED', 'VOLUNTEER_APPROVED'],
    default: 'INFO'
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedEntityId: {
    type: String
  },
  relatedEntityType: {
    type: String
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
